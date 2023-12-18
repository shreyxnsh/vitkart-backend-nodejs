const kycModel = require('../src/../model/kyc.model');
const aws = require('aws-sdk');
const fs = require('fs');
require('dotenv').config();

exports.createKyc = async (req, res) => {
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
      Key: `profilePics/${req.file.originalname}`
    };
  
    s3.upload(params, (err, data) => {
      if (err) {
        console.log('Error occured while trying to upload to S3 bucket', err);
      }
  
      if (data) {
        fs.unlinkSync(req.file.path); // Empty temp folder
        const locationUrl = data.Location;
        let newUser = new kycModel({ ...req.body, profilePic: locationUrl });
        newUser
          .save()
          .then(kyc => {
            res.json({ message: 'KYC submitted successfully', kyc });
          })
          .catch(err => {
            console.log('Error occured while trying to save to DB');
          });
      }
    });
  }

// Get all KYC details
exports.getKyc = async (req, res, next) => {
    try {
        const kycData = await kycModel.find();
        res.json({ status: true, success: kycData });
    } catch (error) {
        next(error);
    }
}
