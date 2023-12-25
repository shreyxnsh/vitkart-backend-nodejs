const User = require("../model/user.model");
const { sendOTP, verifyOTP, deleteOTP } = require("./otp.controller");


// Verify user email OTP
const verifyUserEmail = async ({userEmail, otp}) => {
    try{ 
        const validOTP = await verifyOTP({ userEmail, otp });
        if (!validOTP) {
            throw Error('Invalid OTP');
        }
        // Update user record to show verified
        await User.updateOne({ userEmail}, { isVerified: true });
        
        // Delete if OTP verifited
        await deleteOTP(userEmail);
        return;

    } catch (error) {
        console.log("Unable: Email Verification");
        throw error;


    }
};

// Send OTP verification Emails
exports.sendVerificationOTPEmail = async (userEmail) => {
    try{ 
        // Check if the email account exists
        const exisitingUser = await User.findOne({ userEmail });
        if (!exisitingUser) {
            throw Error("Account doesn't exist");
        }

        const otpDetails = {
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

        if (!(userEmail && otp)) throw Error("Please give all the details");

        await verifyUserEmail({ userEmail, otp })
        res.status(200).json({ userEmail, isVerified: true });

    } catch (error) {
        console.log("Error in emailVerificationRoutes");
        res.status(400).send(error.message);

    }
};


// module.exports = { sendVerificationOTPEmail, verifyUserEmail };