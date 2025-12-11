require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./data/database');

// Importar rutas
const apiRoutes = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({
    origin: ['http://localhost:3000', 'https://tu-app-android.com'], 
    credentials: true
}));
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API My Book funcionando correctamente',
        version: '2.0.0',
        endpoints: {
            usuarios: '/api/usuarios',
            libros: '/api/libros'
        }
    });
});

// Rutas API
app.use('/api', apiRoutes);


app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});


app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(` API Docs: http://localhost:${PORT}/api`);
});

module.exports = app;