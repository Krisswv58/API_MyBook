const express = require('express');
const router = express.Router();
const ArchivoSimpleController = require('../controllers/ArchivoSimpleController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');


router.post('/libro-con-enlaces', authMiddleware, adminMiddleware, ArchivoSimpleController.crearLibroConEnlaces);

module.exports = router;