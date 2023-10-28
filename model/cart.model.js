const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user', // Reference to your User model
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'product', // Reference to your Product model
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1 // You can change the default quantity as needed
    }
});

const CartModel = mongoose.model('Cart', cartSchema);

module.exports = CartModel;
