const ProductService = require('../services/product.services');

// createTodo function to create a todo item for the user and sending to db
// req comes from the frontend to the api
// res is what is sent back to the frontend from the api
exports.createCategory = async (req, res, next)=>{
    try {
       // initializing parameters in the request body 
       const {productName, productDesc, productImage, productCat, productPrice, stock} = req.body;
       // send these 3 data to services
       let product = await ProductService.createProduct(productName, productDesc, productImage, productCat, productPrice, stock);
       res.json({status:true, success: product}); 

    } catch (error) {
        next(error);
    }
}

// function to get all todo tasks of a particular user
exports.getProductByCategory = async (req, res, next) => {
    try {
       // Extract the userId from the query parameters
       const { productCat } = req.query;
       
       // data will be fetched and stored in this todo
       let productByCat = await ProductService.getProductByCategory(productCat);
       res.json({ status: true, success: productByCat });

    } catch (error) {
        next(error);
    }
}

// function to delete todo task of a user
exports.deleteProduct = async (req, res, next) => {
    try {
       // Extract the userId from the query parameters
       const {id} = req.body;
       
       // data will be fetched and stored in this todo
       let deleteProduct = await ProductService.deleteProduct(id);
       res.json({ status: true, success: deleteProduct });

    } catch (error) {
        next(error);
    }
}

