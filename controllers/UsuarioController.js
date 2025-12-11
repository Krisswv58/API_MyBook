const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const Usuario = require('../models/Usuario');

class UsuarioController {
    
    // Registro de usuario
    static async registro(req, res) {
        try {
            const { nombre, email, password, birthday, photo, rol } = req.body;

            if (!nombre || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre, email y contraseña son requeridos'
                });
            }

            const emailExiste = await Usuario.findOne({ email });
            if (emailExiste) {
                return res.status(400).json({
                    success: false,
                    message: 'El email ya está registrado'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const nuevoUsuario = new Usuario({
                id: uuidv4(),
                nombre,
                email,
                password: hashedPassword,
                birthday: birthday ? new Date(birthday) : null,
                photo: photo || null,
                rol: rol === 'admin' ? 'admin' : 'usuario'
            });

            await nuevoUsuario.save();

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: {
                    id: nuevoUsuario.id,
                    nombre: nuevoUsuario.nombre,
                    email: nuevoUsuario.email,
                    birthday: nuevoUsuario.birthday,
                    photo: nuevoUsuario.photo,
                    rol: nuevoUsuario.rol
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Login
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email y contraseña son requeridos'
                });
            }

            const usuario = await Usuario.findOne({ email });
            if (!usuario) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            const passwordValida = await bcrypt.compare(password, usuario.password);
            if (!passwordValida) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            res.json({
                success: true,
                message: 'Login exitoso',
                data: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    birthday: usuario.birthday,
                    photo: usuario.photo,
                    rol: usuario.rol
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener perfil por ID
    static async obtenerPerfil(req, res) {
        try {
            const { id } = req.params;

            const usuario = await Usuario.findOne({ id }, '-password');

            if (!usuario) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            res.json({
                success: true,
                data: usuario
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Actualizar perfil
    static async actualizarPerfil(req, res) {
        try {
            const { id } = req.params;
            const { nombre, birthday, photo } = req.body;

            const datosActualizados = {};
            if (nombre) datosActualizados.nombre = nombre;
            if (birthday) datosActualizados.birthday = new Date(birthday);
            if (photo) datosActualizados.photo = photo;

            const usuarioActualizado = await Usuario.findOneAndUpdate(
                { id },
                datosActualizados,
                { new: true }
            );

            if (!usuarioActualizado) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Perfil actualizado exitosamente',
                data: {
                    id: usuarioActualizado.id,
                    nombre: usuarioActualizado.nombre,
                    email: usuarioActualizado.email,
                    birthday: usuarioActualizado.birthday,
                    photo: usuarioActualizado.photo
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener todos los usuarios
    static async obtenerTodosLosUsuarios(req, res) {
        try {
            const usuarios = await Usuario.find({}, '-password').sort({ createdAt: -1 });
            
            res.json({
                success: true,
                message: 'Usuarios obtenidos exitosamente',
                count: usuarios.length,
                data: usuarios
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Eliminar cuenta
    static async eliminarCuenta(req, res) {
        try {
            const { id } = req.params;

            const usuarioEliminado = await Usuario.findOneAndDelete({ id });

            if (!usuarioEliminado) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Cuenta eliminada exitosamente'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}

module.exports = UsuarioController;
