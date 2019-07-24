const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

//Define a schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    password: { type: String, trim: true, required: true }
});


// hash user password before saving into database
UserSchema.pre('save', (next) => {    
    
    // only hash the password if it has been modified (or is new)
    // if (!user.isModified('password')) return next();
    const salt = bcrypt.genSalt(saltRounds);
    this.password = bcrypt.hash(this.password, salt);
    console.log(this.password);
    next();
});

module.exports = mongoose.model('User', UserSchema);