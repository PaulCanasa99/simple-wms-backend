const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const handlingUnitSchema = new mongoose.Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product'},
    entryDate: { type: Date, default: Date.now() },
    exitDate: { type: Date, default: null },
    expirationDate: Date,
    status: { type: String, default: 'Registrado' },
    location: { type: Schema.Types.ObjectId, ref: 'Location', default: null },
    inboundOrder: { type: Schema.Types.ObjectId, ref: 'InboundOrder'},
    outboundOrder: { type: Schema.Types.ObjectId, ref: 'OutboundOrder', default: null},
    transportOrder: { type: Schema.Types.ObjectId, ref: 'TransportOrder', default: null},
    handlingUnitId: Number
})

handlingUnitSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

handlingUnitSchema.set('toJSON', {
    virtuals: true
});

handlingUnitSchema.plugin(AutoIncrement, {id: 'handlingUnit_counter', inc_field: 'handlingUnitId'})
module.exports = mongoose.model('HandlingUnit', handlingUnitSchema);