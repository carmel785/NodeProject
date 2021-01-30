const mongoose = require('mongoose')
let Schema = mongoose.Schema
let SubscriptionsSchema = new Schema({
    MemberId : String,
    Movies : Array
});

module.exports = mongoose.model('subscriptions' , SubscriptionsSchema);