const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const outboundOrderSchema = new mongoose.Schema({
    handlingUnits: [{ type: Schema.Types.ObjectId, ref: 'HandlingUnit' }],
    status: {type: String, default: 'Pendiente'},
    date: { type: Date, default: Date.now() },
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
})

outboundOrderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

outboundOrderSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('OutboundOrder', outboundOrderSchema);