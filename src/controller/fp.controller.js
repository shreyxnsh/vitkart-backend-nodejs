const User = require('../model/user.model');
const { sendOTP, verifyOTP, deleteOTP } = require('./otp.controller');
const { hashData } = require('../util/hashData');


// reset password
const resetUserPassword = async ({userEmail, otp, newPassword}) => {
    try {
        console.log("Verifying OTP...");
        const validOTP = await verifyOTP({ userEmail, otp });
        console.log("OTP Verification Result:", validOTP);

        if (!validOTP) {
            throw Error("Invalid code passed. Check your inbox.");
        }

        console.log("Updating user password...");
        const hashedNewPassword = await hashData(newPassword);
        await User.updateOne({ userEmail }, { userPassword: hashedNewPassword });
        console.log("Password updated successfully.");

        console.log("Deleting OTP...");
        await deleteOTP(userEmail);
        console.log("OTP deleted.");

        return;
    } catch (error) {
        console.log("ERROR: fp.Controller - resetUserPassword");
        throw error;
    }
};


// send password reset mail
const sendPasswordResetOTPEmail = async ( userEmail ) => {
    try{ 

        // Check if an account exist
        const exisitingUser = await User.findOne({ userEmail });
        if(!exisitingUser){
            throw Error("There is no account for the provided email.");
        }

        if (!exisitingUser.isVerified) {
            throw Error("Please first verify your email address to reset password.")
        }

        const otpDetails = {
            userEmail,
            otpSubject: "Password Reset| @VITKART ",
            otpMessage: "Enter the code below to reset your password.",
            otpDuration: 1
        };

        const createdOTP = await sendOTP(otpDetails);
        return createdOTP;


    } catch (error) {
        throw error;


    }
};

exports.resetPassword = async (req, res) => {
    try {
        let { userEmail, otp, newPassword } = req.body;

        // Log received values
        console.log("Received values:", { userEmail, otp, newPassword });

        if (!(userEmail && otp && newPassword)) {
            throw Error("Empty credentials are not allowed.");
        }

        await resetUserPassword({ userEmail, otp, newPassword });

        // Respond with a success status code ( 204 )
        res.status(200).json({ message: "Password Updated" });
    } catch (error) {
        console.error("Error in password-reset route:", error.message);

        // Respond with an appropriate error status code (e.g., 400 - Bad Request)
        res.status(400).send(error.message);
    }
};


exports.sentOTPOnMail = async (req, res) => {
    try{ 
        const { userEmail } = req.body;
        console.log(req.body);
        if (!userEmail) throw Error("An email is required.");

        // Send reset otp

        const createdPasswordResetOTP = await sendPasswordResetOTPEmail(userEmail);
        const responseData = {
            message: "Password reset OTP sent!",
            userEmail,
            passwordReset: true,
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.log(`Error in password-reset POST /: ${error}`);
        res.status(400).send(error.message);

    }
};


// module.exports = { sendPasswordResetOTPEmail, resetUserPassword };
