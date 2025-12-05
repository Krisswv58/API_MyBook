const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No hay token, acceso denegado'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.findOne({ id: decoded.id });
        
        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
};

module.exports = authMiddleware;