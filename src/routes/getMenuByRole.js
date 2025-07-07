const express = require('express')
const router = express.Router()
const { supabase } = require('../config/db')
const { authMiddleware } = require('../middlewares/auth.middleware')

/**
 * @swagger
 * /api/menus/role/{roleId}:
 *   get:
 *     summary: Ambil daftar menu berdasarkan role
 *     tags:
 *       - Menus
 *     parameters:
 *       - name: roleId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID role
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar menu berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   path:
 *                     type: string
 *                   parent_id:
 *                     type: string
 *                     nullable: true
 *       401:
 *         description: Unauthorized
 */
router.get('/role/:roleId', authMiddleware, async (req, res) => {
    const { roleId } = req.params

    const { data, error } = await supabase
        .from('role_menu_access')
        .select('menu:menus(id, name, path, parent_id)')
        .eq('role_id', roleId)

    if (error) {
        console.error('Error fetching menus by role:', error)
        return res.status(500).json({ error: 'Gagal mengambil menu' })
    }

    const menus = data.map(item => item.menu)
    return res.json(menus)
})

module.exports = router
