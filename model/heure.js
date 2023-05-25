const mongoose = require('mongoose');

const heureSchema = new mongoose.Schema({
    heure1: {
        required: false,
        type: String
    },
    heure2: {
        required: false,
        type: String
    },
   
    heure3: {
        required: false,
        type: String
    }
})

module.exports = mongoose.model('heures', heureSchema);