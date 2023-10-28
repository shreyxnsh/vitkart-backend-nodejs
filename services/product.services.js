const productModel = require('../model/product.model');


class productService{
    // function to create a product
    static async createProduct(productName, productDesc, productImage, productCat, productPrice, stock){
        //create object of the productModel
        const createProduct = new productModel({productName, productDesc, productImage, productCat, productPrice, stock});
        return await createProduct.save();
    }

    // function to get products by categories
    static async getProductByCategory(productCat){
        //create object of todomodel which will fetch data by userid
        // mongoose query to fetch
        const getProductByCategory = await todoModel.find({productCat});
        return getProductByCategory;
    }

     // function to delete a users todo
     static async deleteTodoData(_id){
        //create object of todomodel which will fetch data by userid
        // mongoose query to fetch
        const deletedProduct = await productModel.findOneAndDelete({_id: _id});
        return deletedProduct;
    }

}

module.exports = productService;