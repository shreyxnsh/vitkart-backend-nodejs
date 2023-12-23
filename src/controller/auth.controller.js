
const CryptoJS = require('crypto-js');
const User = require('../model/user.model');
const jwt = require('jsonwebtoken');


exports.registerUser = async (req, res) => {
    try {
        
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(401).json({ error: 'Wrong Email Address!' });
        }

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        if (originalPassword !== req.body.password) {
            return res.status(401).json({ error: 'Wrong Password!' });
        }

        const accessToken = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        );

        const { password, ...others } = user._doc;

        res.status(200).json({ ...others, accessToken });

    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};
