const { v4: uuidv4 } = require('uuid');
const Libro = require('../models/Libro');

class LibroController {
    
    
    static async obtenerLibros(req, res) {
        try {
            const usuarioId = req.usuario.id;

            const libros = await Libro.find({
                $and: [
                    { esPublico: true },
                    { usuariosQueLoEliminaron: { $ne: usuarioId } }
                ]
            }).sort({ createdAt: -1 });

            res.json({
                success: true,
                message: 'Libros obtenidos exitosamente',
                data: libros
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    
    static async obtenerLibrosPorUsuario(req, res) {
        try {
            const { usuarioId } = req.params;
            
            const libros = await Libro.find({ 
                usuarioId,
                esPublico: true 
            }).sort({ createdAt: -1 });

            res.json({
                success: true,
                message: 'Libros del usuario obtenidos exitosamente',
                data: libros
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }


    static async obtenerLibroPorId(req, res) {
        try {
            const { id } = req.params;
            const usuarioId = req.usuario.id;

            const libro = await Libro.findOne({ 
                id,
                usuariosQueLoEliminaron: { $ne: usuarioId }
            });

            if (!libro) {
                return res.status(404).json({
                    success: false,
                    message: 'Libro no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Libro obtenido exitosamente',
                data: libro
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

   
    static async buscarPorTitulo(req, res) {
        try {
            const { titulo } = req.params;
            const usuarioId = req.usuario.id;

            const libros = await Libro.find({
                $and: [
                    { titulo: { $regex: titulo, $options: 'i' } }, 
                    { esPublico: true },
                    { usuariosQueLoEliminaron: { $ne: usuarioId } }
                ]
            }).sort({ createdAt: -1 });

            res.json({
                success: true,
                message: 'Búsqueda completada exitosamente',
                data: libros
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

 
    static async crearLibro(req, res) {
        try {
            const { titulo, autor, descripcion, rutaPdf, photo } = req.body;
            const usuarioId = req.usuario.id;

            
            if (!titulo || !autor) {
                return res.status(400).json({
                    success: false,
                    message: 'Título y autor son requeridos'
                });
            }

          
            const nuevoLibro = new Libro({
                id: uuidv4(),
                titulo,
                autor,
                descripcion: descripcion || '',
                rutaPdf: rutaPdf || '',
                usuarioId,
                photo: photo || '',
                esPublico: true, 
                usuariosQueLoEliminaron: []
            });

            await nuevoLibro.save();

            res.status(201).json({
                success: true,
                message: 'Libro creado exitosamente',
                data: nuevoLibro
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    
    static async actualizarLibro(req, res) {
        try {
            const { id } = req.params;
            const { titulo, autor, descripcion, rutaPdf, photo } = req.body;
            const usuarioId = req.usuario.id;

            
            const libro = await Libro.findOne({ id, usuarioId });
            
            if (!libro) {
                return res.status(404).json({
                    success: false,
                    message: 'Libro no encontrado o no tienes permisos para editarlo'
                });
            }

           
            const datosActualizados = {};
            if (titulo) datosActualizados.titulo = titulo;
            if (autor) datosActualizados.autor = autor;
            if (descripcion !== undefined) datosActualizados.descripcion = descripcion;
            if (rutaPdf !== undefined) datosActualizados.rutaPdf = rutaPdf;
            if (photo !== undefined) datosActualizados.photo = photo;

            const libroActualizado = await Libro.findOneAndUpdate(
                { id, usuarioId },
                datosActualizados,
                { new: true }
            );

            res.json({
                success: true,
                message: 'Libro actualizado exitosamente',
                data: libroActualizado
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    
    static async eliminarLibro(req, res) {
        try {
            const { id } = req.params;
            const usuarioId = req.usuario.id;

            const libro = await Libro.findOne({ id });
            
            if (!libro) {
                return res.status(404).json({
                    success: false,
                    message: 'Libro no encontrado'
                });
            }

           
            if (libro.usuarioId === usuarioId) {
                await Libro.findOneAndDelete({ id });
                return res.json({
                    success: true,
                    message: 'Libro eliminado permanentemente'
                });
            }

          
            if (!libro.usuariosQueLoEliminaron.includes(usuarioId)) {
                libro.usuariosQueLoEliminaron.push(usuarioId);
                await libro.save();
            }

            res.json({
                success: true,
                message: 'Libro ocultado de tu biblioteca'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

   
    static async restaurarLibro(req, res) {
        try {
            const { id } = req.params;
            const usuarioId = req.usuario.id;

            const libro = await Libro.findOne({ id });
            
            if (!libro) {
                return res.status(404).json({
                    success: false,
                    message: 'Libro no encontrado'
                });
            }

            libro.usuariosQueLoEliminaron = libro.usuariosQueLoEliminaron.filter(
                uid => uid !== usuarioId
            );
            await libro.save();

            res.json({
                success: true,
                message: 'Libro restaurado en tu biblioteca',
                data: libro
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    
    static async obtenerTodosLosLibros(req, res) {
        try {
            const libros = await Libro.find({}).sort({ createdAt: -1 });
            
            res.json({
                success: true,
                message: 'Todos los libros obtenidos exitosamente',
                count: libros.length,
                data: libros
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

module.exports = LibroController;