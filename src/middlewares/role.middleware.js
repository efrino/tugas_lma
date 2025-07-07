const supabase = require('../config/db');

/**
 * Middleware generik untuk validasi role berbasis nama role
 * @param {string[]} allowedRoles - nama role yang diperbolehkan (ex: ['admin'])
 */
const authorizeRoles = (allowedRoles) => {
    return async (req, res, next) => {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
        }

        try {
            const { data, error } = await supabase
                .from('user_roles')
                .select('roles(name)')
                .eq('user_id', userId);

            if (error || !data || data.length === 0) {
                return res.status(403).json({ message: 'Akses ditolak: Tidak ada role' });
            }

            const roleNames = data.map((r) => r.roles?.name).filter(Boolean);
            const hasAccess = roleNames.some((role) => allowedRoles.includes(role));

            if (!hasAccess) {
                return res.status(403).json({ message: `Akses ditolak: Role harus salah satu dari: ${allowedRoles.join(', ')}` });
            }

            next();
        } catch (err) {
            console.error('Role middleware error:', err);
            res.status(500).json({ message: 'Terjadi kesalahan otorisasi' });
        }
    };
};

// Middleware khusus
const isAdminMiddleware = authorizeRoles(['admin']);
const isManajerMiddleware = authorizeRoles(['manajer']);
const isUserMiddleware = authorizeRoles(['user', 'staff']); // default user role

module.exports = {
    authorizeRoles,
    isAdminMiddleware,
    isManajerMiddleware,
    isUserMiddleware,
};
