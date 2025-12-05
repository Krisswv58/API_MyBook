const express = require('express');
const router = express.Router();
const LibroController = require('../controllers/LibroController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');


router.use(authMiddleware);


router.get('/', LibroController.obtenerLibros);
router.get('/:id', LibroController.obtenerLibroPorId);
router.post('/', LibroController.crearLibro);
router.put('/:id', LibroController.actualizarLibro);
router.delete('/:id', LibroController.eliminarLibro);


router.get('/buscar/titulo/:titulo', LibroController.buscarPorTitulo);
router.get('/usuario/:usuarioId', LibroController.obtenerLibrosPorUsuario);


router.get('/admin/todos', adminMiddleware, LibroController.obtenerTodosLosLibros);


router.patch('/:id/restaurar', LibroController.restaurarLibro);

module.exports = router;