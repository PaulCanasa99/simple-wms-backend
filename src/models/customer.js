const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    id: String,
    name: String,
    contactName: String,
    contactPhoneNumber: String,
    address: String,
})

module.exports = mongoose.model('Customer', customerSchema);