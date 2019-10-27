const mongoose = require('mongoose');


//Define a schema
const Schema = mongoose.Schema;

const blockMasterSchema = new Schema({
    block: { type: String, trim: true, required: true },
    detail: { type: String, trim: true, required: true },
    isActive: { type: Boolean }
});



blockMasterSchema.pre('save', (next) => {    
    next();
});

module.exports = mongoose.model('blocks', blockMasterSchema);