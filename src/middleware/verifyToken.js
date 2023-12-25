const jwt = require("jsonwebtoken");


const verifyToken = async (req, res, next)  => {
  // const authHeader = req.headers.token
  // if (authHeader) {


  //   const token = authHeader.split(" ")[1];

  //   jwt.verify(token, process.env.JWT_SEC, (err, user) => {
  //     if (err) res.status(403).json("Token is not valid!");
  //     req.user = user;
  //     next();
  //   });
  // } else {
  //   return res.status(401).json("You are not authenticated!");
  // }

  try {
    const token =
        req.body.token || req.query.token || req.headers.token;

    if (!token) {
        return res.status(403).json({ error: "An authentication token is required" });
    }

    // Verify token
    const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
    req.currentUser = decodedToken;

    // If token is verified, proceed with the request
    return next();
} catch (error) {
    // If the token is invalid or there's an error in verification
    return res.status(401).json({ error: "Invalid token provided" });
}
};



module.exports = {
  verifyToken,

};
