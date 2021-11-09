const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderSchema = new mongoose.Schema({
  customer: {type: Schema.Types.ObjectId, ref: 'Customer'},
  products: [
    {
      product: {type: Schema.Types.ObjectId, ref: 'Product'},
      quantity: Number,
      status: {type: String, default: 'Pendiente'},
    }  
  ],
  outboundOrders: [{type: Schema.Types.ObjectId, ref: 'OutboundOrder', default: null}],
  status: {type: String, default: 'Pendiente'},
  date: { type: Date, default: Date.now() },
  orderId: Number,
})

orderSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

orderSchema.set('toJSON', {
  virtuals: true
});

orderSchema.plugin(AutoIncrement, {id: 'order_counter', inc_field: 'orderId'})

module.exports = mongoose.model('Order', orderSchema);