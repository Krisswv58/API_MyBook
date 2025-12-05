const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
    id: {type: String, unique: true, required: true},
    titulo: {type: String, required: true},
    autor: {type: String, required: true},
    descripcion: {type: String},
    rutaPdf: {type: String}, 
    usuarioId: {type: String, required: true},
    photo: {type: String}, 
    esPublico: {type: Boolean, default: true}, 
    usuariosQueLoEliminaron: [{type: String}] 
},{timestamps: true});

module.exports = mongoose.model('Libro', libroSchema);
