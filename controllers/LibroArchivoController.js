const { v4: uuidv4 } = require('uuid');
const { BlobServiceClient } = require('@azure/storage-blob');
const multer = require('multer');
const Libro = require('../models/Libro');

// ============================================
// CONFIGURACIÓN DE MULTER
// ============================================
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'imagen') {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Solo se permiten archivos de imagen'));
            }
        } else if (file.fieldname === 'pdf') {
            if (file.mimetype === 'application/pdf') {
                cb(null, true);
            } else {
                cb(new Error('Solo se permiten archivos PDF'));
            }
        } else {
            cb(new Error('Campo de archivo no válido'));
        }
    }
});

// ============================================
// LIBRO CONTROLLER
// ============================================
class LibroController {

    // Obtener libros públicos (excluyendo los eliminados por el usuario)
    static async obtenerLibros(req, res) {
        try {
            const { usuarioId } = req.query;

            let filtro = { esPublico: true };
            
            if (usuarioId) {
                filtro.usuariosQueLoEliminaron = { $ne: usuarioId };
            }

            const libros = await Libro.find(filtro).sort({ createdAt: -1 });

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

    // Obtener libros por usuario
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

    // Obtener libro por ID
    static async obtenerLibroPorId(req, res) {
        try {
            const { id } = req.params;
            const { usuarioId } = req.query;

            let filtro = { id };
            
            if (usuarioId) {
                filtro.usuariosQueLoEliminaron = { $ne: usuarioId };
            }

            const libro = await Libro.findOne(filtro);

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

    // Buscar por título
    static async buscarPorTitulo(req, res) {
        try {
            const { titulo } = req.params;
            const { usuarioId } = req.query;

            let filtro = {
                titulo: { $regex: titulo, $options: 'i' },
                esPublico: true
            };

            if (usuarioId) {
                filtro.usuariosQueLoEliminaron = { $ne: usuarioId };
            }

            const libros = await Libro.find(filtro).sort({ createdAt: -1 });

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

    // Crear libro
    static async crearLibro(req, res) {
        try {
            const { titulo, autor, descripcion, rutaPdf, photo, usuarioId } = req.body;

            if (!titulo || !autor || !usuarioId) {
                return res.status(400).json({
                    success: false,
                    message: 'Título, autor y usuarioId son requeridos'
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

    // Actualizar libro
    static async actualizarLibro(req, res) {
        try {
            const { id } = req.params;
            const { titulo, autor, descripcion, rutaPdf, photo, usuarioId } = req.body;

            if (!usuarioId) {
                return res.status(400).json({
                    success: false,
                    message: 'usuarioId es requerido'
                });
            }

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

    // Eliminar libro
    static async eliminarLibro(req, res) {
        try {
            const { id } = req.params;
            const { usuarioId } = req.body;

            if (!usuarioId) {
                return res.status(400).json({
                    success: false,
                    message: 'usuarioId es requerido'
                });
            }

            const libro = await Libro.findOne({ id });
            
            if (!libro) {
                return res.status(404).json({
                    success: false,
                    message: 'Libro no encontrado'
                });
            }

            // Si es el dueño, eliminar permanentemente
            if (libro.usuarioId === usuarioId) {
                await Libro.findOneAndDelete({ id });
                return res.json({
                    success: true,
                    message: 'Libro eliminado permanentemente'
                });
            }

            // Si no es dueño, ocultar de su biblioteca
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

    // Restaurar libro
    static async restaurarLibro(req, res) {
        try {
            const { id } = req.params;
            const { usuarioId } = req.body;

            if (!usuarioId) {
                return res.status(400).json({
                    success: false,
                    message: 'usuarioId es requerido'
                });
            }

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

    // Obtener todos los libros (admin)
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

// ============================================
// ARCHIVO CONTROLLER (Azure Blob Storage)
// ============================================
class ArchivoController {
    
    constructor() {
        this.connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        this.blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
        this.containerImagenes = process.env.AZURE_STORAGE_CONTAINER_IMAGENES;
        this.containerPdfs = process.env.AZURE_STORAGE_CONTAINER_PDFS;
    }

    // Subir archivos y crear libro
    static async subirArchivos(req, res) {
        try {
            const { titulo, autor, descripcion, usuarioId } = req.body;
            
            if (!titulo || !autor || !usuarioId) {
                return res.status(400).json({
                    success: false,
                    message: 'Titulo, autor y usuarioId son requeridos'
                });
            }

            if (!req.files || !req.files.imagen) {
                return res.status(400).json({
                    success: false,
                    message: 'La imagen es requerida'
                });
            }

            const controller = new ArchivoController();
            
            const urlImagen = await controller.subirImagen(req.files.imagen[0]);
            
            let urlPdf = '';
            if (req.files.pdf && req.files.pdf[0]) {
                urlPdf = await controller.subirPdf(req.files.pdf[0]);
            }

            const nuevoReq = {
                ...req,
                body: {
                    titulo,
                    autor,
                    descripcion,
                    usuarioId,
                    photo: urlImagen,
                    rutaPdf: urlPdf
                }
            };

            await LibroController.crearLibro(nuevoReq, res);

        } catch (error) {
            console.error('Error en subirArchivos:', error);
            res.status(500).json({
                success: false,
                message: 'Error al subir archivos',
                error: error.message
            });
        }
    }

    async subirImagen(file) {
        try {
            const containerClient = this.blobServiceClient.getContainerClient(this.containerImagenes);

            const extension = file.originalname.split('.').pop();
            const blobName = `${uuidv4()}.${extension}`;

            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            await blockBlobClient.uploadData(file.buffer, {
                blobHTTPHeaders: { 
                    blobContentType: file.mimetype 
                }
            });

            const url = await this.generarUrlConSAS(blockBlobClient);

            console.log(`Imagen subida: ${url}`);
            return url;

        } catch (error) {
            console.error('Error al subir la imagen a Azure Blob Storage:', error);
            throw error;
        }
    }

    async subirPdf(file) {
        try {
            const containerClient = this.blobServiceClient.getContainerClient(this.containerPdfs);

            const extension = file.originalname.split('.').pop();
            const blobName = `${uuidv4()}.${extension}`;

            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            await blockBlobClient.uploadData(file.buffer, {
                blobHTTPHeaders: { 
                    blobContentType: file.mimetype 
                }
            });

            const url = await this.generarUrlConSAS(blockBlobClient);

            console.log(`PDF subido: ${url}`);
            return url;

        } catch (error) {
            console.error('Error al subir el PDF a Azure Blob Storage:', error);
            throw error;
        }
    }

    async generarUrlConSAS(blockBlobClient) {
        try {
            const { BlobSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } = require('@azure/storage-blob');
            
            const accountName = process.env.AZURE_STORAGE_CONNECTION_STRING.match(/AccountName=([^;]+)/)[1];
            const accountKey = process.env.AZURE_STORAGE_CONNECTION_STRING.match(/AccountKey=([^;]+)/)[1];
            
            const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
            
            const expiresOn = new Date();
            expiresOn.setFullYear(expiresOn.getFullYear() + 10);
            
            const sasToken = generateBlobSASQueryParameters({
                containerName: blockBlobClient.containerName,
                blobName: blockBlobClient.name,
                permissions: BlobSASPermissions.parse("r"),
                expiresOn: expiresOn
            }, sharedKeyCredential).toString();
            
            return `${blockBlobClient.url}?${sasToken}`;
            
        } catch (error) {
            console.error('Error generando SAS token:', error);
            return blockBlobClient.url;
        }
    }

    // Eliminar archivo de Azure
    static async eliminarArchivo(req, res) {
        try {
            const { url, tipo } = req.body;

            if (!url) {
                return res.status(400).json({
                    success: false,
                    message: 'URL del archivo es requerida'
                });
            }

            const controller = new ArchivoController();
            const containerName = tipo === 'imagen' ? controller.containerImagenes : controller.containerPdfs;
            const containerClient = controller.blobServiceClient.getContainerClient(containerName);

            const blobName = url.split('/').pop().split('?')[0];
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            await blockBlobClient.delete();
            console.log(`Archivo eliminado: ${blobName}`);

            res.json({
                success: true,
                message: 'Archivo eliminado exitosamente'
            });

        } catch (error) {
            console.error('Error al eliminar archivo:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar el archivo de Azure Blob Storage',
                error: error.message
            });
        }
    }
}

module.exports = { LibroController, ArchivoController, upload };
