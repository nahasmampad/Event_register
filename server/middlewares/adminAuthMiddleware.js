const jwt = require("jsonwebtoken");
module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Auth failed", success: false });
      } else {
        req.body.userId = 123456;
        
        next();
      }
    });
  } catch (error) {
    return res.stataus(401).send({ message: "Auth failed", success: false });
  }
};
