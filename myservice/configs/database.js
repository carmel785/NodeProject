const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/webserviceDB')
const db = mongoose.connection
console.log("db connected")