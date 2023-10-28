const productModel = require('../model/product.model');


class productService{
    // function to create a product
    static async createProduct(productName, productDesc, productImage, productCat, productPrice, stock){
        //create object of the productModel
        const createProduct = new productModel({productName, productDesc, productImage, productCat, productPrice, stock});
        return await createProduct.save();
    }

    // function to get products by categories
    static async getProductsByCategory(productCat) {
        try {
          const products = await productModel.find({ productCat }).populate('productCat');
          return products;
        } catch (error) {
          throw error;
        }
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