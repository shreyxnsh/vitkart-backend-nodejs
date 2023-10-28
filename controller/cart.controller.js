const CartModel = require('../model/cart.model'); // You'll need to create a cart model
const ProductModel = require('../model/product.model'); // Import the product model
const mongoose = require('mongoose');

// Add a product to the cart
exports.addToCart = async (req, res, next) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Check if the product exists and if the user exists
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(400).json({ status: false, error: 'Product not found' });
        }

        // Create or update the user's cart entry
        const cartEntry = await CartModel.findOneAndUpdate(
            { user: userId, product: productId },
            { $set: { quantity } },
            { new: true, upsert: true }
        );

        res.json({ status: true, success: 'Product added to cart', cartEntry });
    } catch (error) {
        next(error);
    }
};

// Function to get the user's cart and calculate the total value
exports.getCart = async (req, res, next) => {
    try {
        const userId = req.user._id; // Assuming you have user data in the request object

        const cartItems = await CartModel.find({ user: userId }).populate('product');
        
        let totalValue = 0;
        for (const item of cartItems) {
            totalValue += item.product.productPrice * item.quantity;
        }

        res.json({ status: true, cart: cartItems, totalValue: totalValue });
    } catch (error) {
        next(error);
    }
}

// Update the quantity of a product in the cart
exports.updateCartProduct = async (req, res, next) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Check if the product exists
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(400).json({ status: false, error: 'Product not found' });
        }

        // Update the user's cart entry
        const cartEntry = await CartModel.findOneAndUpdate(
            { user: userId, product: productId },
            { $set: { quantity } },
            { new: true }
        );

        res.json({ status: true, success: 'Cart updated', cartEntry });
    } catch (error) {
        next(error);
    }
};

// Remove a product from the cart
exports.removeFromCart = async (req, res, next) => {
    try {
        const { userId, productId } = req.query;

        // Remove the user's cart entry
        const result = await CartModel.deleteOne({ user: userId, product: productId });

        res.json({ status: true, success: 'Product removed from cart', result });
    } catch (error) {
        next(error);
    }
};
