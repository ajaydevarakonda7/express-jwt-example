const HttpError = require("./HttpError");
const jwt = require("jsonwebtoken");

async function validateToken(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw new HttpError("Authorization error", 401);
    }

    const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
    const options = {
      expiresIn: "2d",
      issuer: "http://localhost",
    };

    const result = jwt.verify(token, process.env.JWT_SECRET, options);
    req.decoded = result;
    next()
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).send(err);
  }
}

module.exports = { validateToken };
