const User = require("../models/users");
const bcrypt = require("bcrypt");
const HttpError = require("../HttpError");
const jwt = require("jsonwebtoken");

module.exports = {
  add: async function (req, res) {
    try {
      const { name, password } = req.body;
      const user = new User({ name, password });

      const result = await user.save();
      res.status(201).send(result);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  },

  login: async function (req, res) {
    try {
      const { name, password } = req.body;

      const user = await User.findOne({ name });

      if (!user) {
        throw new HttpError("User not found", 404);
      }

      const {        
        password: userPassword, // mutil user of pass.
        __v: ignore,            // and extras.
        ...userSafe             // now we can send this to the user.
      } = user.toObject();
      const isSamePassword = await bcrypt.compare(password, user.password);

      if (isSamePassword) {
        // create a jwt token.
        const payload = { user: user.name }
        const options = { expiresIn: "2d", issuer: "http://localhost" }
        const secret = process.env.JWT_SECRET
        const token = jwt.sign(payload, secret, options)

        return res.send({ token, user: userSafe })
      }

      throw new HttpError("Authentication error", 401)
    } catch (err) {
      console.error(err)
      res.status(err.statusCode || 500).send(err)
    }
  },

  getAll: async function (req, res) {
    try {
      const allUsers = await User.find({})
      return res.send(allUsers)
    } catch (err) {
      console.error(err)
      res.status(500).send(err)
    }
  },
};
