const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');


router.post('/registro', UsuarioController.registro);
router.post('/login', UsuarioController.login);

router.get('/perfil', authMiddleware, UsuarioController.obtenerPerfil);
router.put('/perfil', authMiddleware, UsuarioController.actualizarPerfil);


router.get('/todos', adminMiddleware, UsuarioController.obtenerTodosLosUsuarios);

module.exports = router;