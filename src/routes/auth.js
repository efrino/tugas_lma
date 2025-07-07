const express = require('express');
const router = express.Router();
const {supabase} = require('../config/db');
const { hash, compare } = require('../utils/hash');
const { createJWT } = require('../utils/token');
const { authMiddleware } = require('../middlewares/auth.middleware');

// ========== MODEL FUNCTIONS ========== //
const getUserByUsername = async (username) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .maybeSingle();

    return data || null;
};

const getUserRoles = async (userId) => {
    const { data, error } = await supabase
        .from('user_roles')
        .select('role_id, roles(name)')
        .eq('user_id', userId);

    if (error) return [];
    return data.map((item) => ({
        id: item.role_id,
        name: item.roles?.name || 'Unknown',
    }));
};

// ========== SWAGGER TAG ========== //
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autentikasi pengguna
 */

// ========== LOGIN ========== //
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: efrino
 *               password:
 *                 type: string
 *                 example: evrino123
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *       401:
 *         description: Kredensial tidak valid
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await getUserByUsername(username);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const roles = await getUserRoles(user.id);
    const token = createJWT({ userId: user.id, username: user.username });

    res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
        },
        roles,
    });
});

// ========== REGISTER ========== //
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrasi user baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *       400:
 *         description: Username sudah digunakan
 *       500:
 *         description: Kesalahan server
 */
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
        return res.status(400).json({ message: 'Username sudah digunakan' });
    }

    try {
        const passwordHash = await hash(password);
        const { data: user, error } = await supabase
            .from('users')
            .insert([{ username, password_hash: passwordHash }])
            .select()
            .single();

        if (error) throw error;

        // Tambahkan role default
        const { data: role } = await supabase
            .from('roles')
            .select('id')
            .eq('name', 'staff')
            .maybeSingle();

        if (role) {
            await supabase.from('user_roles').insert([{ user_id: user.id, role_id: role.id }]);
        }

        res.status(201).json({
            message: 'Registrasi berhasil',
            user: {
                id: user.id,
                username: user.username,
                created_at: user.created_at,
            },
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Terjadi kesalahan saat registrasi' });
    }
});

// ========== SELECT ROLE ========== //
/**
 * @swagger
 * /api/auth/select-role:
 *   post:
 *     summary: Pilih role aktif setelah login
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role_id
 *             properties:
 *               role_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role berhasil dipilih dan token baru diberikan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 selected_role:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *       400:
 *         description: Role tidak valid atau tidak dimiliki user
 *       401:
 *         description: Unauthorized
 */
router.post('/select-role', authMiddleware, async (req, res) => {
    const { role_id } = req.body;
    const userId = req.user.userId; // ✅ fix: gunakan userId, bukan id

    if (!role_id) {
        return res.status(400).json({ message: 'role_id wajib diisi' });
    }

    try {
        const { data: userRole } = await supabase
            .from('user_roles')
            .select('role_id')
            .eq('user_id', userId)
            .eq('role_id', role_id)
            .maybeSingle();

        if (!userRole) {
            return res.status(400).json({ message: 'Role tidak valid atau tidak dimiliki user' });
        }

        const { data: roleData } = await supabase
            .from('roles')
            .select('name')
            .eq('id', role_id)
            .maybeSingle();

        const token = createJWT({
            userId: req.user.userId,
            username: req.user.username,
            roleId: role_id,
            roleName: roleData?.name || null,
        });

        res.json({
            token,
            selected_role: {
                id: role_id,
                name: roleData?.name || null,
            },
        });
    } catch (err) {
        console.error('select-role error:', err.message);
        res.status(500).json({ message: 'Terjadi kesalahan saat memilih role' });
    }
});

module.exports = router;
