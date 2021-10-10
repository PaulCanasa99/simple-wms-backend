const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new mongoose.Schema({
    code: String,
    xDistance: Number,
    yDistance: Number,
    zDistance: Number,
    clasification: String,
    status: {type: String, default: 'Libre'},
    handlingUnit: { type: Schema.Types.ObjectId, ref: 'HandlingUnit', default: null },
})

locationSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

locationSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Location', locationSchema);