const userModel = require('../model/user.model');
const jwt = require('jsonwebtoken');

// Function to register a new user
exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const createUser = new userModel({ email, password });
        const successRes = await createUser.save();
        res.json({ status: true, success: 'User registered successfully' });
    } catch (error) {
        throw error;
    }
}

// Function to check if a user is registered in the database
exports.checkUser = async (email) => {
    try {
        return await userModel.findOne({ email });
    } catch (error) {
        throw error;
    }
}

// Function to generate a JWT token for user login
exports.generateJWT = async (tokenData, secretKey, jwt_expire) => {
    return jwt.sign(tokenData, secretKey, { expiresIn: jwt_expire });
}

// Function for user login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await exports.checkUser(email);
        
        if (!user) {
            throw new Error('User does not exist');
        }

        const isMatch = await user.comparePassword(password);

        if (isMatch === false) {
            throw new Error('Password is not valid');
        }

        const tokenData = { _id: user._id, email: user.email };
        const token = await exports.generateJWT(tokenData, 'secretkey', '1h');

        res.status(200).json({ status: true, token: token });
    } catch (error) {
        throw error;
    }
}
