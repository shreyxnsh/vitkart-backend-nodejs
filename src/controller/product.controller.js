const aws = require('aws-sdk');
const fs = require('fs');
const productModel = require('../src/../model/product.model');
require('dotenv').config();

exports.createProduct = async (req, res) => {
    aws.config.setPromisesDependency();
    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_S3_REGION
    });
    const s3 = new aws.S3();
    var params = {
      ACL: 'public-read',
      Bucket: process.env.AWS_S3_BUCKET,
      Body: fs.createReadStream(req.file.path),
      Key: `products/${req.file.originalname}`
    };
  
    s3.upload(params, (err, data) => {
      if (err) {
        console.log('Error occured while trying to upload to S3 bucket', err);
      }
  
      if (data) {
        fs.unlinkSync(req.file.path); // Empty temp folder
        const locationUrl = data.Location;
        let newProduct = new productModel({ ...req.body, productImage: locationUrl });
        newProduct
          .save()
          .then(product => {
            res.json({ message: 'Product added successfully', product });
          })
          .catch(err => {
            console.log('Error occured while trying to save to DB');
          });
      }
    });
  }


exports.getProducts = async (req, res, next) => {
    try {
        const products = await productModel.find();
        res.json({ status: true, success: products });
    } catch (error) {
        next(error);
    }

}

exports.getProductbyId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const productData = await productModel.findById(id);
        res.json({ status: true, success: productData });
    } catch (error) {
        next(error);
    }
}

exports.getProductsByCategory = async (req, res, next) => {
    try {
        const { productCat } = req.params;
        const products = await productModel.find({ productCat });
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
        const deletedProduct = await productModel.findOneAndDelete({ _id: id });
        res.json({ status: true, success: deletedProduct });
    } catch (error) {
        next(error);
    }
}

