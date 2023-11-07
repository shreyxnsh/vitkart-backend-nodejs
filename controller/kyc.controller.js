const kycModel = require('../model/kyc.model');

// Add KYC details
exports.createKyc = async (req, res, next) => {
    try {
        const { firstName, lastName, regNo, email, contact, joiningYear, source } = req.body;

        // Check if the provided regNo, email, and contact are unique
        const existingKyc = await kycModel.findOne({ $or: [{ regNo }, { email }, { contact }] });
        if (existingKyc) {
            return res.status(400).json({ status: false, error: 'KYC with the same regNo, email, or contact already exists.' });
        }

        const addKyc = new kycModel({ firstName, lastName, regNo, email, contact, joiningYear, source });
        const createKyc = await addKyc.save();
        res.json({ status: true, success: createKyc });
    } catch (error) {
        next(error);
    }
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
