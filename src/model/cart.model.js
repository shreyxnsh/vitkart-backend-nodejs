const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      unique: true
    },
    items: [{
      product: {
        type: Schema.Types.ObjectId,
        ref: 'product'
      },
      quantity: {
        type: Number,
        required: true
      }
    }]
});

const CartModel = mongoose.model('Cart', cartSchema);

module.exports = CartModel;
