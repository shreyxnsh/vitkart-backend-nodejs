const bcrypt = require("bcrypt");

exports.hashData = async (data, saltRounds = 10) => {
    try { 
        const hashedData = await bcrypt.hash(data, saltRounds);
        return hashedData;

    } catch (error){
        throw error;
    }
};

exports.verifyHashedData = async (unhashed, hashed) => {
    try {
        const match = await bcrypt.compare(unhashed, hashed);
        return match;
    } catch (error) {
        console.log("Error in verifyHashedData:", error.message);
        throw error;
    }
};


// module.exports = { hashData, verifyHashedData };

