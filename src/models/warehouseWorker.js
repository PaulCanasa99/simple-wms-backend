const mongoose = require("mongoose");

const warehouseWorkerSchema = new mongoose.Schema({
    name: String,
    password: String,
})

warehouseWorkerSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

warehouseWorkerSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('WarehouseWorker', warehouseWorkerSchema);