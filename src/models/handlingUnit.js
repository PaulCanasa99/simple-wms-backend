const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const handlingUnitSchema = new mongoose.Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product'},
    entryDate: { type: Date, default: Date.now() },
    exitDate: { type: Date, default: null },
    expirationDate: Date,
    status: { type: String, default: 'Registrado' }
})

handlingUnitSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

handlingUnitSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('HandlingUnit', handlingUnitSchema);