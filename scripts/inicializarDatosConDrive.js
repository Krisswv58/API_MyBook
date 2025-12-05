
require('dotenv').config();
const Usuario = require('../models/Usuario');
const Libro = require('../models/Libro');
const connectDB = require('../data/database');
const bcrypt = require('bcryptjs');

async function inicializarDatos() {
    try {
        await connectDB();
        console.log('Conectado a MongoDB');

        
        await Usuario.deleteMany({});
        await Libro.deleteMany({});
        console.log('Datos anteriores eliminados');

    
        const adminPassword = await bcrypt.hash('admin123', 10);
        const admin = await Usuario.create({
            id: 'admin-001',
            nombre: 'Administrador',
            email: 'admin@mybook.com',
            password: adminPassword,
            birthday: '1990-01-01',
            photo: 'https://drive.google.com/uc?id=1K8xQy_ejemplo_admin_photo',
            rol: 'admin'
        });
        console.log('Usuario admin creado');

        
        const libros = [
            {
                id: 'libro-001',
                titulo: 'El Amante de Lady Sofia',
                autor: 'Lisa Kleypas',
                descripcion: 'Lady Sofía Hathaway, decidida a vengar la injusticia que cayó sobre su familia, se acerca estratégicamente al inspector Ross Cannon, un hombre disciplinado y respetado. Lo que inicia como un plan calculado se convierte en una relación cargada de pasión y redención, donde ambos descubren deseos y emociones que no esperaban.',
                photo: 'https://drive.google.com/uc?id=15lcesxZ93OYA0gvG3toyEiJ6SdQRWax0',
                rutaPdf: 'https://drive.google.com/uc?id=1Bs3N62NUh_1l2Z0_r7QC--p9yGW5Qpz7',
                esPublico: true,
                usuarioId: admin.id,
                usuariosQueLoEliminaron: []
            },
            {
                id: 'libro-002',
                titulo: 'El diablo en invierno',
                autor: 'Lisa Kleypas',
                descripcion: 'Evie Jenner, una joven tímida y tartamuda, sorprende a todos cuando busca al libertino Sebastian St. Vincent para proponerle un matrimonio de conveniencia. Lo que empieza como un arreglo urgente evoluciona en una relación profunda donde Evie saca el lado más humano de Sebastian, y él descubre un amor que jamás imaginó posible.',
                photo: 'https://drive.google.com/uc?id=1nBTvzphGnXcJeY8Bwnt3xOvI32dcBQzi',
                rutaPdf: 'https://drive.google.com/uc?id=1zhMkUbmfrEWRx1H9yTzLs0JALoWLSsge',
                esPublico: true,
                usuarioId: admin.id,
                usuariosQueLoEliminaron: []
            },
            {
                id: 'libro-003',
                titulo: 'Mi bella desconocida',
                autor: 'Lisa Kleypas',
                descripcion: 'Grant Morgan, uno de los solteros más codiciados de Londres, rescata a una misteriosa joven que ha perdido la memoria. Convencido de que ella es una famosa cortesana, intenta usar la situación a su favor… hasta que descubre que la verdad es mucho más compleja. Entre intrigas, secretos y atracción, ambos se ven arrastrados a una historia de identidad y amor.',
                photo: 'https://drive.google.com/uc?id=1NrxQQ-R5CKjMoB3jrZQFwYDrrYClzP6R',
                rutaPdf: 'https://drive.google.com/uc?id=1H61cGRXIL0YvG2MHmSReZNRbO6HGlcer',
                esPublico: true,
                usuarioId: admin.id,
                usuariosQueLoEliminaron: []
            },
            {
                id: 'libro-004',
                titulo: 'Porque eres Mia',
                autor: 'Lisa Kleypas',
                descripcion: 'Aleksandr Blackwood, un hombre obsesionado con el control, se enfrenta a sus emociones cuando conoce a la dulce y firme Jessica Wentworth. Lo que inicia como una relación marcada por la tensión se transforma en una conexión intensa donde ambos deben sanar heridas del pasado para poder amar sin miedo.',
                photo: 'https://drive.google.com/uc?id=1UNeVWU9509srM1uESPIzN8KXzr7NQGuF',
                rutaPdf: 'https://drive.google.com/uc?id=1l7DbTvuX6Zxo6ti_OvF-BZKgMqAbyslk',
                esPublico: true,
                usuarioId: admin.id,
                usuariosQueLoEliminaron: []
            },
            {
                id: 'libro-005',
                titulo: 'Un extraño en mis brazos',
                autor: 'Lisa Kleypas',
                descripcion: 'Lara, una mujer atrapada en un matrimonio infeliz, queda sorprendida cuando su esposo —presuntamente muerto— regresa convertido en un hombre mucho más amable y apasionado que el que recordaba. Mientras intenta descubrir si es realmente la misma persona o un impostor, se encuentra cayendo en una relación llena de ternura, misterio y deseo.',
                photo: 'https://drive.google.com/uc?id=1U2XZ_qMSuKj6Y6qUXB4sEOL97nJNy3Gg',
                rutaPdf: 'https://drive.google.com/uc?id=1tYRmFqYkEWVgXYOQAcvb-P4elVHgbnes',
                esPublico: true,
                usuarioId: admin.id,
                usuariosQueLoEliminaron: []
            }
        ];

        await Libro.insertMany(libros);
        console.log('5 libros de Lisa Kleypas creados con enlaces de Google Drive');

        console.log('\nDATOS INICIALIZADOS CORRECTAMENTE CON TUS LIBROS REALES');
        console.log('\nCREDENCIALES DE ADMINISTRADOR:');
        console.log('Admin - Email: admin@mybook.com, Password: admin123');
        
        console.log('\nLIBROS DE LISA KLEYPAS CREADOS:');
        console.log('Publicos: El Amante de Lady Sofia, El diablo en invierno, Mi bella desconocida');
        console.log('Publicos: Porque eres Mia, Un extraño en mis brazos');
        
        console.log('\nAPI LISTA PARA USAR');
        console.log('Ejecuta: npm start');
        
        console.log('\nENDPOINTS DISPONIBLES:');
        console.log('POST /api/usuarios/registro - Registrar nuevo usuario');
        console.log('POST /api/usuarios/login - Iniciar sesion');
        console.log('GET /api/libros - Ver libros publicos + propios');
        console.log('POST /api/simple/libro-con-enlaces - Agregar libro con Drive (admin)');

        process.exit(0);

    } catch (error) {
        console.error('Error inicializando datos:', error.message);
        process.exit(1);
    }
}

inicializarDatos();