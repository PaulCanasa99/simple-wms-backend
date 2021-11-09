const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const inboundOrderSchema = new mongoose.Schema({
    handlingUnits: [{ type: Schema.Types.ObjectId, ref: 'HandlingUnit' }],
    warehouseWorker: { type: Schema.Types.ObjectId, ref: 'WarehouseWorker', default: null},
    status: {type: String, default: 'Pendiente'},
    date: { type: Date, default: Date.now() },
    inboundOrderId: Number,
})

inboundOrderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

inboundOrderSchema.set('toJSON', {
    virtuals: true
});

inboundOrderSchema.plugin(AutoIncrement, {id: 'inboundOrder_counter', inc_field: 'inboundOrderId'})

module.exports = mongoose.model('InboundOrder', inboundOrderSchema);