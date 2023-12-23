const Cart = require("../model/cart.model");

exports.createCart = async (req, res) => {
    try {
        // Check if a cart already exists for the user
        const existingCart = await Cart.findOne({ userId: req.body.userId });

        if (existingCart) {
            // If a cart exists, respond with a message
            return res.status(400).json({ message: "Cart already created!" });
        }

        // If no cart exists, create a new one
        const newCart = new Cart(req.body);
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.updateCart = async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.deleteCartItem = async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart item has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.findUserCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json(err);
    }
};
