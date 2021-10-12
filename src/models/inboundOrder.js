const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const HandlingUnit = require("../models/handlingUnit");

const inboundOrderSchema = new mongoose.Schema({
    handlingUnits: [{ type: Schema.Types.ObjectId, ref: 'HandlingUnit' }],
    warehouseWorker: { type: Schema.Types.ObjectId, ref: 'WarehouseWorker', default: null},
    status: {type: String, default: 'Pendiente'},
    date: { type: Date, default: Date.now() },
})

inboundOrderSchema.pre('save', function(next){
  HandlingUnit.insertMany(this.handlingUnits, function(err, res){
      if(err) throw err;
      next();
  })
});

inboundOrderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

inboundOrderSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('InboundOrder', inboundOrderSchema);