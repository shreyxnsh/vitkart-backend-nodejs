const CartModel = require('../model/cart.model'); // You'll need to create a cart model
const ProductModel = require('../model/product.model'); // Import the product model
const mongoose = require('mongoose');

// Add product to cart
exports.addToCart = async (req, res) => {
    mongoose.set('bufferCommands', false);
    try {
        const { productId, quantity } = req.body;
        let cart = await CartModel.findOne({ userId: req.user._id });
        if (!cart) {
            cart = new CartModel({ userId: req.user._id });
        }
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        cart.items.push({ productId: product._id, quantity: quantity });
        await cart.save();
        res.status(200).send('Product added to cart');
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// Update product quantity in cart
exports.updateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await CartModel.findOne({ userId: req.user._id });
        const item = cart.items.find(i => i.productId.toString() === productId);
        if (!item) {
            return res.status(404).send('Product not found in cart');
        }
        item.quantity = quantity;
        await cart.save();
        res.status(200).send('Cart updated');
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// View all products in cart
exports.viewCart = async (req, res) => {
    try {
        const cart = await CartModel.findOne({ userId: req.user._id });
        res.status(200).send(cart);
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// Delete product from cart
exports.deleteFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const cart = await CartModel.findOne({ userId: req.user._id });
        const itemIndex = cart.items.findIndex(i => i.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).send('Product not found in cart');
        }
        cart.items.splice(itemIndex, 1);
        await cart.save();
        res.status(200).send('Product removed from cart');
    } catch (error) {
        res.status(500).send('Server error');
    }
};

// View total value of cart
exports.viewCartValue = async (req, res) => {
    try {
        const cart = await CartModel.findOne({ userId: req.user._id });
        let totalValue = 0;
        for (let item of cart.items) {
            const product = await ProductModel.findById(item.productId);
            if (!product) {
                return res.status(404).send('Product not found');
            }
            totalValue += product.price * item.quantity;
        }
        res.status(200).send({ totalValue });
    } catch (error) {
        res.status(500).send('Server error');
    }
};

