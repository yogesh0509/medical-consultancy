const mongoose = require('mongoose');

let newSchema = new mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    question: {type: String, required: true},
    answer: {type: String}
});

module.exports = mongoose.model('doubt', newSchema);