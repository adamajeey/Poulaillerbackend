const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    nom: {
        required: false,
        type: String
    },
    prenom: {
        required: false,
        type: String
    },
   
    email: {
        required: false,
        type: String
    },
    password:{
        required: false,
        type: String
    }
})

module.exports = mongoose.model('user', dataSchema);