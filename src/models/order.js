const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
  customer: {type: Schema.Types.ObjectId, ref: 'Customer'},
  products: [
    {
      product: {type: Schema.Types.ObjectId, ref: 'Product'},
      quantity: Number 
    }  
  ],
  status: {type: String, default: 'Pendiente'},
  date: { type: Date, default: Date.now() },
})

orderSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

orderSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Order', orderSchema);