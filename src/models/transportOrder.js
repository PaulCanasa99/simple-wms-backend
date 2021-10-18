const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transportOrderSchema = new mongoose.Schema({
    handlingUnit: { type: Schema.Types.ObjectId, ref: 'HandlingUnit' },
    warehouseWorker: { type: Schema.Types.ObjectId, ref: 'WarehouseWorker', default: null},
    location: { type: Schema.Types.ObjectId, ref: 'Location'},
    status: {type: String, default: 'Pendiente'},
    date: { type: Date, default: Date.now() },
    inboundOrder: { type: Schema.Types.ObjectId, ref: 'InboundOrder', default: null },
    outboundOrder: { type: Schema.Types.ObjectId, ref: 'OutboundOrder', default: null },
})

transportOrderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

transportOrderSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('TransportOrder', transportOrderSchema);