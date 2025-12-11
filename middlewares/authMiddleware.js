const Usuario = require('../models/Usuario');

// Middleware para validar que el usuario existe
const validarUsuario = async (req, res, next) => {
    try {
        const usuarioId = req.body.usuarioId || req.params.id || req.query.usuarioId;

        if (!usuarioId) {
            return res.status(400).json({
                success: false,
                message: 'usuarioId es requerido'
            });
        }

        const usuario = await Usuario.findOne({ id: usuarioId });
        
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en validación de usuario',
            error: error.message
        });
    }
};

// Middleware para validar que el usuario es admin
const validarAdmin = async (req, res, next) => {
    try {
        const usuarioId = req.body.usuarioId || req.params.id || req.query.usuarioId;

        if (!usuarioId) {
            return res.status(400).json({
                success: false,
                message: 'usuarioId es requerido para operaciones de admin'
            });
        }

        const usuario = await Usuario.findOne({ id: usuarioId });
        
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        if (usuario.rol !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Solo administradores'
            });
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en validación de admin',
            error: error.message
        });
    }
};

module.exports = { validarUsuario, validarAdmin };
