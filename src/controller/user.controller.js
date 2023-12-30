const User = require('../model/user.model')
const { hashData, verifyHashedData } = require('../util/hashData')
const createToken = require('../util/createToken')
const {
  sendVerificationOTPEmail
} = require('../controller/emailVerification.controller')

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
    const {
      userName,
      userRegID,
      userEmail,
      userGender,
      userPassword,
      userBatch,
      userBirthDate,
      userContactNum,
    } = data

    const existingUser = await User.findOne({ email: userEmail })

    if (existingUser) {
      throw Error('User already exists')
    }

    // Hash Passwords
    const hashedPassword = await hashData(userPassword)
    const newUser = new User({
      userName,
      userRegID,
      userEmail,
      userGender,
      userPassword: hashedPassword,
      userBatch,
      userBirthDate,
      userContactNum,
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
    let { userEmail, userPassword } = req.body
    userEmail = userEmail.trim()
    userPassword = userPassword.trim()

    if (!(userEmail && userPassword)) {
      throw Error('Empty credentials supplied')
    }

    const authenticatedUser = await authenticateUser({
      userEmail,
      userPassword,
    })

    res
      .status(200)
      .json({ status: true, message: 'SignIn successful', authenticatedUser })
  } catch (error) {
    res.status(400).send(error.message)
  }
}

// Sign Up
exports.signUp = async (req, res) => {
  try {
    const {
      userName,
      userRegID,
      userEmail,
      userGender,
      userPassword,
      userBatch,
      userBirthDate,
      userContactNum,
    } = req.body

    console.log('Received data:', req.body)

    console.log('Variables before trimming:', {
      userName,
      userRegID,
      userEmail,
      userGender,
      userPassword,
      userBatch,
      userBirthDate,
      userContactNum,
    })

    // Ensure all variables are defined before using trim()

    const trimmedUserName = userName
    const trimmedUserRegID = userRegID ? userRegID.trim() : ''
    const trimmedUserEmail = userEmail ? userEmail.trim() : ''
    const trimmedUserGender = userGender ? userGender.trim() : ''
    const trimmedUserPassword = userPassword ? userPassword.trim() : ''
    const trimmedUserBatch = userBatch ? userBatch.trim() : ''
    const trimmedUserBirthDate = userBirthDate ? userBirthDate.trim() : ''
    const trimmedUserContact = userContactNum ? userContactNum.trim() : ''

    const validationErrors = []

    // Check for empty input fields
    if (!trimmedUserEmail || !trimmedUserRegID || !trimmedUserPassword) {
      validationErrors.push('Empty input fields!')
    }

    // Validate email format
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,47}$/.test(trimmedUserEmail)) {
      validationErrors.push('Invalid email entered')
    }

    // Validate password length
    if (!trimmedUserPassword || trimmedUserPassword.length < 8) {
      validationErrors.push('Password is too short!')
    }

    if (trimmedUserBatch && !/^\d{4}$/.test(trimmedUserBatch)) {
      validationErrors.push('Invalid user batch! It must be a 4-digit number.')
    }

    if (
      trimmedUserBirthDate &&
      !/^\d{4}-\d{2}-\d{2}$/.test(trimmedUserBirthDate)
    ) {
      validationErrors.push('Invalid user birth date format!')
    }

    if (trimmedUserContact && !/^[0-9]{10}$/.test(trimmedUserContact)) {
      validationErrors.push('Invalid user contact number format!')
    }

    // If there are validation errors, send them in the response
    if (validationErrors.length > 0) {
      res.status(400).json({ errors: validationErrors })
      return
    }

    // The rest of your signup logic goes here
    const newUser = await createNewUser({
      userName: trimmedUserName,
      userRegID: trimmedUserRegID,
      userEmail: trimmedUserEmail,
      userGender: trimmedUserGender,
      userPassword: trimmedUserPassword,
      userBatch: trimmedUserBatch,
      userBirthDate: trimmedUserBirthDate,
      userContactNum: trimmedUserContact,
    })

    await sendVerificationOTPEmail(userEmail)
    res.status(200).json({ message: 'Signup successful', user: newUser })
    console.log('Verification Email Sent | Line 150')
  } catch (error) {
    console.error('Error in signup:', error)

    // Send a more informative error response
    res
      .status(500)
      .json({ error: 'Internal server error', details: error.message })
  }
}

// module.exports = { createNewUser, authenticateUser };
