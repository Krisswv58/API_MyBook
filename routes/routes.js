const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');
const { LibroController, ArchivoController, upload } = require('../controllers/LibroArchivoController');


router.post('/usuarios/registro', UsuarioController.registro);
router.post('/usuarios/login', UsuarioController.login);


router.get('/usuarios/:id', UsuarioController.obtenerPerfil);
router.put('/usuarios/:id', UsuarioController.actualizarPerfil);
router.delete('/usuarios/:id', UsuarioController.eliminarCuenta);


router.get('/usuarios', UsuarioController.obtenerTodosLosUsuarios);


router.get('/libros', LibroController.obtenerLibros);
router.get('/libros/buscar/titulo/:titulo', LibroController.buscarPorTitulo);
router.get('/libros/usuario/:usuarioId', LibroController.obtenerLibrosPorUsuario);
router.get('/libros/:id', LibroController.obtenerLibroPorId);


router.post('/libros', LibroController.crearLibro);
router.put('/libros/:id', LibroController.actualizarLibro);
router.delete('/libros/:id', LibroController.eliminarLibro);
router.patch('/libros/:id/restaurar', LibroController.restaurarLibro);


router.get('/libros/admin/todos', LibroController.obtenerTodosLosLibros);


router.post('/libros/subir', 
    upload.fields([
        { name: 'imagen', maxCount: 1 },
        { name: 'pdf', maxCount: 1 }
    ]), 
    ArchivoController.subirArchivos
);


router.delete('/libros/eliminar', ArchivoController.eliminarArchivo);

module.exports = router;
