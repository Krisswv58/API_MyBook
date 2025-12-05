const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    id: {type: String, unique: true, required: true},
    nombre: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    birthday: {type: Date},
    photo: {type: String},
    rol: {type: String, enum: ['usuario', 'admin'], default: 'usuario'} 
},{timestamps: true});

module.exports = mongoose.model('Usuario', usuarioSchema);

