const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

const verifyToken = async (req, res, next) => {
    try {
      const token =
        req.body.token || req.query.token || req.headers.token;
  
      if (!token) {
        return res
          .status(403)
          .json({ error: "An authentication token is required" });
      }
  
      // Verify token
      const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
      req.currentUser = decodedToken;
  
      // Log decoded token for debugging
      console.log("Decoded Token:", decodedToken);
  
  
      // If token is verified, proceed with the request
      return next();
    } catch (error) {
      // Log the error for debugging
      console.error("Token Verification Error:", error);
  
      // If the token is invalid or there's an error in verification
      return res.status(401).json({ error: "Invalid token provided" });
    }
  };

  const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const { currentUser } = req;
            const user = await getUserFromDatabase(currentUser.userID);

            if (user.isAdmin) {
                console.log("You are an admin");
                next();
            } else {
                console.log("You are not an admin");
                res.status(403).json("You are not allowed to do that!");
            }
        } catch (error) {
            console.error("Error checking admin status:", error);
            res.status(500).json("Internal server error");
        }
    });
};

  const verifyTokenAndClubAdmin = (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const { currentUser } = req;
            const user = await getUserFromDatabase(currentUser.userID);

            if (user.isClubAdmin) {
                console.log("You are a club admin");
                next();
            } else {
                console.log("You are not a club admin");
                res.status(403).json("You are not allowed to do that!");
            }
        } catch (error) {
            console.error("Error checking admin status:", error);
            res.status(500).json("Internal server error");
        }
    });
};

// Function to get user from the database based on userID
const getUserFromDatabase = async (userID) => {
    // Implement your logic to retrieve user data from the database
    // This might involve using the User model or another database query
    // For simplicity, I'm assuming there's a User model with a findById method
    const user = await User.findById(userID);
    return user;
};

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndClubAdmin,
};
