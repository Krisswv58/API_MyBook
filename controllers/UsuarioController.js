const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Usuario = require('../models/Usuario');

class UsuarioController {
    
    
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

           
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            
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

          
            const token = jwt.sign(
                { id: nuevoUsuario.id, rol: nuevoUsuario.rol }, 
                process.env.JWT_SECRET, 
                { expiresIn: '7d' }
            );

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: {
                    usuario: {
                        id: nuevoUsuario.id,
                        nombre: nuevoUsuario.nombre,
                        email: nuevoUsuario.email,
                        birthday: nuevoUsuario.birthday,
                        photo: nuevoUsuario.photo
                    },
                    token
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

          
            const token = jwt.sign(
                { id: usuario.id, rol: usuario.rol }, 
                process.env.JWT_SECRET, 
                { expiresIn: '7d' }
            );

            res.json({
                success: true,
                message: 'Login exitoso',
                data: {
                    usuario: {
                        id: usuario.id,
                        nombre: usuario.nombre,
                        email: usuario.email,
                        birthday: usuario.birthday,
                        photo: usuario.photo,
                        rol: usuario.rol
                    },
                    token
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

    
    static async obtenerPerfil(req, res) {
        try {
            const usuario = req.usuario; 

            res.json({
                success: true,
                data: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    birthday: usuario.birthday,
                    photo: usuario.photo
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

   
    static async actualizarPerfil(req, res) {
        try {
            const { nombre, birthday, photo } = req.body;
            const usuarioId = req.usuario.id;

           
            const datosActualizados = {};
            if (nombre) datosActualizados.nombre = nombre;
            if (birthday) datosActualizados.birthday = new Date(birthday);
            if (photo) datosActualizados.photo = photo;

            const usuarioActualizado = await Usuario.findOneAndUpdate(
                { id: usuarioId },
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
}

module.exports = UsuarioController;