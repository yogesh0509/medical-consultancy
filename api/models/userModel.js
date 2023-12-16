const mongoose = require('mongoose');

let newSchema = new mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    
});

module.exports = mongoose.model('user', newSchema);