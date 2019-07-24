const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
    debugger;
    bcrypt.hash(this.password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        this.password = hash;
    });
    next();
});

module.exports = mongoose.model('User', UserSchema);