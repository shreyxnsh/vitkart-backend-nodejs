const ProductModel = require('../src/../model/product.model');
const mongoose = require('mongoose');

// Function to create a product
exports.createProduct = async (req, res, next) => {
    try {
        // Initializing parameters in the request body
        const { productName, productDesc, productImage, productCat, productPrice, stock } = req.body;
        // Create a new product using the ProductModel
        const createdProduct = new ProductModel({ productName, productDesc, productImage, productCat, productPrice, stock });
        // Save the product to the database
        const product = await createdProduct.save();
        
        res.json({ status: true, success: product });
    } catch (error) {
        next(error);
    }
}

// Get a list of all products for a specific product category
exports.getProductsByCategory = async (req, res, next) => {
    try {
        const { productCat } = req.query;
        
        // Check if the productCat is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(productCat)) {
            return res.status(400).json({ status: false, error: 'Invalid category ID' });
        }

        // Call the service to get products by category
        const products = await ProductModel.find({ productCat }).populate('productCat');
        res.json({ status: true, success: products });
    } catch (error) {
        next(error);
    }
};

// Function to delete a product by ID
exports.deleteProduct = async (req, res, next) => {
    try {
        // Extract the product ID from the query parameters
        const { id } = req.body;
        // Delete the product
        const deletedProduct = await ProductModel.findOneAndDelete({ _id: id });
        res.json({ status: true, success: deletedProduct });
    } catch (error) {
        next(error);
    }
}
