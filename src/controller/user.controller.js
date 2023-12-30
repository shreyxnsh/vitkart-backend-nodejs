const UserModel = require('../models/user.model');
const mongoose = require('mongoose');


// Create new users
exports.createUser = async (req, res) => {
    try {
        const { userEmail } = req.body;

        // Check if the user's email contains '@vitbhopal.ac.in'
        if (!userEmail || !userEmail.includes('@vitbhopal.ac.in')) {
            return res.status(400).json({
                error: 'Invalid Email',
                message: 'Please sign up with a university email address (e.g., example@vitbhopal.ac.in).',
            });
        }

        const savedUser = await UserModel.create(req.body);
        res.status(201).json({
            message: 'User created successfully',
            user: savedUser,
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Validation error from Mongoose
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                error: 'Validation Error',
                message: validationErrors,
            });
        } else if (error.code === 11000) {
            // Duplicate key error (unique constraint violation)
            return res.status(409).json({
                error: 'Conflict',
                message: 'User with the same registration ID or email already exists.',
            });
        } else {
            // Handle other unexpected errors
            console.error('Error creating user:', error);
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'An internal server error occurred while creating the user.',
            });
        }
    }
};


// get All users 
exports.getUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        if (!users) {
            return res.status(404).json({
                error: 'No Users Found',
            });
        }
        res.json({
            message: 'Users retrieved successfully ',
            users: users,
        });
    } catch (error) {
        console.error('Error getting user information:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get Users by ID

exports.getUserbyID = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                message: 'No user found with the provided ID.',
            });
        }

        res.status(200).json({
            message: 'User retrieved successfully',
            user,
        });
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'An internal server error occurred while retrieving the user.',
        });
    }
};
// Update user by ID
exports.updateUser = async (req, res) => {
    try {
        const userIdToUpdate = req.params.id;
        const userDataToUpdate = req.body.user;

        // Validate that userDataToUpdate is not empty
        if (!userDataToUpdate || Object.keys(userDataToUpdate).length === 0) {
            return res.status(400).json({ error: 'User data to update is missing or empty' });
        }

        const updatedUser = await UserModel.findOneAndUpdate(
            { '_id': userIdToUpdate },
            { $set: userDataToUpdate },
            { new: true }
        );

        // Check if user was not found
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        // Handle different types of errors
        console.error('Error updating user:', error);

        if (error.name === 'ValidationError') {
            // Mongoose validation error
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: 'Validation Error', details: validationErrors });
        }

        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Delete users by ID
exports.deleteUser = async (req, res) => {
  
    try {
        const userIdToDelete = req.params.id;
  
        const deletedUser = await UserModel.findOneAndDelete({ 'user._id': userIdToDelete });
  
        if (!deletedUser) {
            return res.status(404).send('User not found');
        }
  
        res.status(200).json(deletedUser);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal Server Error');
    }
};

