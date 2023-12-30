const Product = require("../model/product.model");
require('dotenv').config();
const aws = require('aws-sdk');
const fs = require('fs');


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
      let newProduct = new Product({ ...req.body, productImage: locationUrl });
      newProduct
        .save()
        .then(product => {
          res.json({status: true, message: 'Product added successfully', product });
        })
        .catch(err => {
          console.log('Error occured while trying to save to DB');
          return res.status(500).json({ status: false, message: 'Internal Server Error' });
        });
    }
  });
}


exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json({ status: true, product: updatedProduct });
        console.log('Error in line 55, product controller')
    } catch (err) {
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: true, message: "Product has been deleted..." });
    } catch (err) {
        console.log('Error in line 65, product controller')
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

exports.findProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json({ status: true, product });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

exports.getAllProducts = async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;

        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(1);
        } else if (qCategory) {
            products = await Product.find({
                productCategory: {
                    $in: [qCategory],
                },
            });
        } else {
            products = await Product.find();
        }

        res.status(200).json({ status: true, products});
    } catch (err) {
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

exports.getProductStats = async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await Product.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json({ status: true, data });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};
