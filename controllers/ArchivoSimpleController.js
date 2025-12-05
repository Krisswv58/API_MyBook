const LibroController = require('./LibroController');

class ArchivoSimpleController {
    
    
    static async crearLibroConEnlaces(req, res) {
        try {
            const { titulo, autor, descripcion, enlaceImagen, enlacePdf } = req.body;
            
            if (!titulo || !autor || !enlaceImagen) {
                return res.status(400).json({
                    success: false,
                    message: 'Título, autor y enlace de imagen son requeridos'
                });
            }

            
            const imagenDirecta = convertirEnlaceDrive(enlaceImagen);
            const pdfDirecto = enlacePdf ? convertirEnlaceDrive(enlacePdf) : '';

          
            const nuevoReq = {
                ...req,
                body: {
                    titulo,
                    autor,
                    descripcion,
                    photo: imagenDirecta,
                    rutaPdf: pdfDirecto
                }
            };

            await LibroController.crearLibro(nuevoReq, res);

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}


function convertirEnlaceDrive(enlace) {
    if (enlace.includes('drive.google.com/file/d/')) {
        const fileId = enlace.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
        return fileId ? `https://drive.google.com/uc?id=${fileId}` : enlace;
    }
    return enlace;
}

module.exports = ArchivoSimpleController;