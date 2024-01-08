const User = require('../model/user.model')
const { hashData, verifyHashedData } = require('../util/hashData')
const createToken = require('../util/createToken')
const { sendVerificationOTPEmail } = require('../controller/emailVerification.controller')

// Authenticate User
const authenticateUser = async (data) => {
  try {
    const { userEmail, userPassword } = data
    const fetchedUser = await User.findOne({
      userEmail,
    })

    if (!fetchedUser) {
      throw Error('Invalid email entered!')
    }

    if (!fetchedUser.isVerified) {
      throw Error('Please verify your email!')
    }

    const hashedPassword = fetchedUser.userPassword
    const passwordMatch = await verifyHashedData(userPassword, hashedPassword)

    if (!passwordMatch) {
      throw Error('Invalid password entered!')
    }

    // If there is a match, create a token
    const tokenData = {
      userID: fetchedUser._id,
      userEmail: fetchedUser.userEmail,
      userName: fetchedUser.userName,
      userBatch: fetchedUser.userBatch,
      userBirthDate: fetchedUser.userBirthDate,
      userContact: fetchedUser.userContact,      
      userRegID: fetchedUser.userRegID,
      userGender: fetchedUser.userGender,
    }
    const token = await createToken(tokenData)

    // Assign user token
    fetchedUser.token = token
    return fetchedUser
  } catch (error) {
    throw error
  }
}

// Create User
const createNewUser = async (data) => {
  try {
    const {userEmail, userPassword, ...userData } = data;

    const existingUser = await User.findOne({ userEmail: userEmail })

    if (existingUser) {
      throw Error('User already exists')
    }

    // Hash Passwords
    const hashedPassword = await hashData(userPassword)
    const newUser = new User({
      userEmail: userEmail,
      userPassword: hashedPassword,
      ...userData,
    })

    const createdUser = await newUser.save()
    return createdUser
  } catch (error) {
    throw error
  }
}

// Sign In
exports.signIn = async (req, res) => {
  try {
    let { userEmail, userPassword } = req.body;
    userEmail = userEmail;
    userPassword = userPassword;

    if (!(userEmail && userPassword)) {
      throw new Error('Empty credentials supplied');rs
    }

    const authenticatedUser = await authenticateUser({
      userEmail,
      userPassword,
    });

    // Log the authenticated user for debugging purposes
    console.log('Authenticated User:', authenticatedUser);

    res.status(200).json({
      success: true,
      message: 'Sign-in successful',
      authenticatedUser,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Sign-in Error:', error);

    res.status(401).json({
      status: false,
      message: 'Invalid credentials',
    });
  }
};

// Sign Up
exports.signUp = async (req, res) => {
  try {
    const { userEmail, userPassword, ...userData} = req.body;

    console.log('Received data:', req.body)

    const checkUser = await User.findOne({userEmail})

    if (checkUser) {
      res.status(400).json({ status: false, errors: "User Already Exist" })
      return
    }

    const newUser = await createNewUser({
      userEmail: userEmail,
      userPassword: userPassword,
      ...userData,
    })

    await sendVerificationOTPEmail(newUser.userName, newUser.userEmail)
    res.status(200).json({ message: 'Signup successful', status: true, user: newUser })
  } catch (error) {
    console.error('Error in signup:', error)

    // Send a more informative error response
    res.status(500).json({error: 'Internal server error', status: false, details: error.message })
  }
}

// module.exports = { createNewUser, authenticateUser };
