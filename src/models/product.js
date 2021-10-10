const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    code: String,
    name: String,
    rotation: String,
    clasification: String,
    productsPerHU: Number,
})

productSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Product', productSchema);