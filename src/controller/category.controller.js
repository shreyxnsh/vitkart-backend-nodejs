const categoryModel = require('../src/../model/category.model');

const aws = require('aws-sdk');
const fs = require('fs');
require('dotenv').config();



// Create a new category
exports.createCategory = async (req, res) => {
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
      Key: `categories/${req.file.originalname}`
    };
  
    s3.upload(params, (err, data) => {
      if (err) {
        console.log('Error occured while trying to upload to S3 bucket', err);
      }
  
      if (data) {
        fs.unlinkSync(req.file.path); // Empty temp folder
        const locationUrl = data.Location;
        let newCategory = new categoryModel({ ...req.body, categoryImage: locationUrl });
        newCategory
          .save()
          .then(category => {
            res.json({ message: 'Category added successfully', category });
          })
          .catch(err => {
            console.log('Error occured while trying to save to DB');
          });
      }
    });
  }

// Get all categories
exports.getCategories = async (req, res, next) => {
    try {
        const categoryData = await categoryModel.find();
        res.json({ status: true, success: categoryData });
    } catch (error) {
        next(error);
    }
}

// Get a specific category by ID
exports.getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const categoryData = await categoryModel.findById(id);
        res.json({ status: true, success: categoryData });
    } catch (error) {
        next(error);
    }
}

// Delete a category
exports.deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.body;
        const deletedCategory = await categoryModel.findOneAndDelete({ _id: id });
        res.json({ status: true, success: deletedCategory });
    } catch (error) {
        next(error);
    }
}
