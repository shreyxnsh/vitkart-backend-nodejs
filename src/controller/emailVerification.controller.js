const User = require("../model/user.model");
const { sendOTP, verifyOTP, deleteOTP } = require("./otp.controller");


// Verify user email OTP
const updateVerification = async ({userEmail, otp}) => {
    try{ 
        const validOTP = await verifyOTP({ userEmail, otp });
        if (!validOTP) {
            return 'Invalid OTP';
        }
        // Update user record to show verified
        await User.updateOne({ userEmail}, { isVerified: true });
        
        // Delete if OTP verifited
        await deleteOTP(userEmail);
        return;

    } catch (error) {
        console.log("Unable: Email Verification");
        return 'Error in email verification';


    }
};

// Send OTP verification Emails
exports.sendVerificationOTPEmail = async (userName, userEmail) => {
    try{ 
        // Check if the email account exists
        const exisitingUser = await User.findOne({ userEmail });
        if (!exisitingUser) {
            throw Error("Account doesn't exist");
        }

        const otpDetails = {
            userName,
            userEmail,
            otpSubject: "Email Verification | @VITKART ",
            otpMessage: "Verify your email with the code below",
            otpDuration: 1

        };

        const createdOTP = await sendOTP(otpDetails);
        return createdOTP;

    } catch (error) {
        throw error;

    }
};


exports.sendOTPEmail = async (req, res) => {
    try{ 
        const { userEmail } = req.body;
        //Check if recieved userEmail field
        if(!userEmail) throw Error("An email is required!");

        //Send verification Mail
        const createdEmailVerificationOTP = await sendVerificationOTPEmail(userEmail);
        res.status(200).json({ message: "OTP Sent",  createdEmailVerificationOTP} );
    } catch (error) {
        console.log("Error in emailVerification Routes 1");
        res.status(400).send(error.message); 

    }
};

exports.verifyEmail = async (req, res) => {
    try{ 
        let { userEmail, otp} = req.body;

        if (!(userEmail && otp)) {
            return res.status(400).json({ status: false, message: "Please provide all the details" });
        }

        const verificationResult = await updateVerification({ userEmail, otp });

        if (verificationResult) {
            return res.status(400).json({ status: false, message: verificationResult });
        }

        res.status(200).json({ status: true,userEmail, isVerified: true });

    } catch (error) {
        console.log("Error in emailVerificationRoutes");
        res.status(500).json({ status: false, message: "Internal Server Error" });

    }
};


// module.exports = { sendVerificationOTPEmail, verifyUserEmail };