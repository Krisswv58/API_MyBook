const adminMiddleware = (req, res, next) => {
    try {
        if (!req.usuario) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }

        if (req.usuario.rol !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Solo administradores'
            });
        }

        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en middleware de admin',
            error: error.message
        });
    }
};

module.exports = adminMiddleware;