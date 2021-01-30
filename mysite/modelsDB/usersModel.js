const mongoose = require('mongoose')
let Schema = mongoose.Schema
let UserSchema = new Schema({
    User : String,
    Password : String
});

module.exports = mongoose.model('users' , UserSchema);