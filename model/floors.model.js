const mongoose = require('mongoose');


//Define a schema
const Schema = mongoose.Schema;

const floorsSchema = new Schema({
    name: { type: String, trim: true, required: true },
    detail: { type: String, trim: true, required: true },
    isActive: { type: Boolean }
});



floorsSchema.pre('save', (next) => {    
    next();
});

module.exports = mongoose.model('floors', floorsSchema);