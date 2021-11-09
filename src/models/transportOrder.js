const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const transportOrderSchema = new mongoose.Schema({
    handlingUnit: { type: Schema.Types.ObjectId, ref: 'HandlingUnit' },
    warehouseWorker: { type: Schema.Types.ObjectId, ref: 'WarehouseWorker', default: null},
    location: { type: Schema.Types.ObjectId, ref: 'Location'},
    status: {type: String, default: 'Pendiente'},
    date: { type: Date, default: Date.now() },
    inboundOrder: { type: Schema.Types.ObjectId, ref: 'InboundOrder', default: null },
    outboundOrder: { type: Schema.Types.ObjectId, ref: 'OutboundOrder', default: null },
    transportOrderId: Number
})

transportOrderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

transportOrderSchema.set('toJSON', {
    virtuals: true
});

transportOrderSchema.plugin(AutoIncrement, {id: 'transportOrder_counter', inc_field: 'transportOrderId'})

module.exports = mongoose.model('TransportOrder', transportOrderSchema);