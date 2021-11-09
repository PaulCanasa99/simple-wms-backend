const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const outboundOrderSchema = new mongoose.Schema({
    handlingUnits: [{ type: Schema.Types.ObjectId, ref: 'HandlingUnit' }],
    status: {type: String, default: 'Pendiente'},
    date: { type: Date, default: Date.now() },
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    outboundOrderId: Number
})

outboundOrderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

outboundOrderSchema.set('toJSON', {
    virtuals: true
});

outboundOrderSchema.plugin(AutoIncrement, {id: 'outboundOrder_counter', inc_field: 'outboundOrderId'})

module.exports = mongoose.model('OutboundOrder', outboundOrderSchema);