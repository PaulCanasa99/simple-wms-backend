const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const handlingUnitSchema = new mongoose.Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product'},
    entryDate: { type: Date, default: Date.now() },
    exitDate: { type: Date, default: null },
    expirationDate: Date,
    status: { type: String, default: 'Registrado' },
    location: { type: Schema.Types.ObjectId, ref: 'Location', default: null },
    inboundOrder: { type: Schema.Types.ObjectId, ref: 'InboundOrder'},
    outboundOrder: { type: Schema.Types.ObjectId, ref: 'OutboundOrder', default: null},
})

handlingUnitSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

handlingUnitSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('HandlingUnit', handlingUnitSchema);