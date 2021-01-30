const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/websiteDB')
const db = mongoose.connection
console.log("db connected from website")