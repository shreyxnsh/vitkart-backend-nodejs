const OTP = require('../model/otp.model');
const {generateOTP} = require('../util/generateOTP');
const {sendEmail} = require('../util/sendEmail');
const { hashData, verifyHashedData } = require('../util/hashData');
const { AUTH_EMAIL } = process.env;


// verify OTP
exports.verifyOTP = async ({ userEmail, otp }) => {
    try {
        console.log("Verifying OTP for", userEmail);

        if (!(userEmail && otp)) {
            throw Error("Provide values for email and otp");
        }

        // Ensure OTP exists in the database
        const matchedOTPRecord = await OTP.findOne({
            userEmail,
        });

        if (!matchedOTPRecord) {
            throw Error(`No OTP found for this ${userEmail}`);
        }

        // Retrieve hashed OTP from the database
        const { expiresAt, otp: hashedOTP } = matchedOTPRecord;
        console.log("Hashed OTP from the database:", hashedOTP);

        // Checking for expired code
        if (expiresAt < Date.now()) {
            // Delete expired OTP from the database
            await OTP.deleteOne({ userEmail });
            throw Error('Code has expired. Request for a new one.');
        }

        // If not expired and does exist, verify the provided OTP
        const validOTP = await verifyHashedData(otp, hashedOTP);
        console.log("OTP Verification Result:", validOTP);

        return validOTP;
    } catch (error) {
        console.error("Error in OTP Controller 1:", error.message);
        throw error;
    }
};


exports.sendOTP = async ({userName, userEmail, otpSubject, otpMessage, otpDuration = 1 }) => {
    try {
        if (!(userName, userEmail && otpSubject && otpMessage)) {
            throw Error("Provide values for email, subject, message");
        }
        // Clear old record, for creating a new OTP
        await OTP.deleteOne({ userEmail });
        // Generate pin
        const generatedOTP = await generateOTP();
        // send email
        const mailOptions = {
            from: AUTH_EMAIL,
            to: userEmail,
            subject: otpSubject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; text-align: center;">One-Time Password (OTP) for Your Account</h2>
                    
                    <p style="font-size: 16px; line-height: 1.5; color: #555;">Dear ${userName},</p>
                    
                    <p style="font-size: 18px; line-height: 1.5; color: #333;">Your One-Time Password (OTP) is:</p>
                    
                    <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-radius: 5px;">
                        <p style="font-size: 25px; color: #333; letter-spacing: 2px; margin: 0;"><b>${generatedOTP}</b></p>
                    </div>
                    
                    <p style="font-size: 16px; line-height: 1.5; color: #555;">This code expires in ${otpDuration} hour(s).</p>
                    
                    <p style="font-size: 16px; line-height: 1.5; color: #555;">If you did not request this code, please ignore this email.</p>
                    
                    <p style="font-size: 16px; line-height: 1.5; color: #555;">Best regards,<br>Team VITKART</p>
                </div>
            `,
        };
        
        await sendEmail(mailOptions);

        // Hash and save OTP data
         const hashedOTP = await hashData(generatedOTP);
         console.log(hashedOTP)
         const newOTP = await new OTP({
            userName,
            userEmail,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: (Date.now() + (3600 * 1000 * otpDuration)), // Converted into miliseconds
         });

         const createdOTPRecord = await newOTP.save();
         return createdOTPRecord;
        
    } catch (error){
        console.log("Located: OTP Contoller 2")
        throw error;
    }
}

exports.deleteOTP = async (userEmail) => {
    try {
        await OTP.deleteOne({ userEmail });
    } catch (error) {
        console.log("Located: OTP Controller 3");
        throw error;
    }
};



exports.verify = async (req, res) => {
    try {
        let { userEmail, otp } = req.body;

        const isValidOTP = await verifyOTP({ userEmail, otp });
        res.status(200).json({ valid: isValidOTP });

    } catch (error) {
        console.error("Error in OTP verification:", error);
        res.status(400).send(error.message);
    }
};


exports.send = async (req, res) => {
    try{
        const { userEmail, otpSubject, otpMessage, otpDuration } = req.body;

        const createdOTP = await sendOTP({
            userEmail,
            otpSubject,
            otpMessage,
            otpDuration,

        });
        res.status(200).json({message: 'OTP Sent' , createdOTP});
    } catch (error) {
        console.log("Located: OTP Routes");
        res.status(400).send(error.message);

    } 
};


// module.exports = { sendOTP, verifyOTP, deleteOTP };
