// const User = require("../models/users");
const bcrypt = require("bcrypt");
const HttpError = require("../HttpError");
const jwt = require("jsonwebtoken");

const environment = process.env.NODE_ENV; // development
const stage = require("../config")[environment];
const { insertUser, findUser } = require("../db/user");

module.exports = {
  add: async function (req, res) {
    try {
      const { name, password } = req.body;
      const { dbClient: client } = req.app.locals;

      // const user = new User({ name, password });
      // const result = await user.save();
      const passwordHashed = await bcrypt.hash(password, stage.saltingRounds);

      const { result } = await insertUser(client, name, passwordHashed);

      res.status(201).send();
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  },

  login: async function (req, res) {
    try {
      const { name, password } = req.body;
      const { dbClient: client } = req.app.locals;

      // const user = await User.findOne({ name });
      const { result } = await findUser(client, name);
      const [ user ] = result;

      if (!user) {
        throw new HttpError("User not found", 404);
      }

      const {
        password: userPassword, // mutil user of pass.
        __v: ignore, // and extras.
        ...userSafe // now we can send this to the user.
      } = user;
      const isSamePassword = await bcrypt.compare(password, user.password);

      if (isSamePassword) {
        // create a jwt token.
        const payload = { user: user.name };
        const options = { expiresIn: "2d", issuer: "http://localhost" };
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secret, options);

        return res.send({ token, user: userSafe });
      }

      throw new HttpError("Authentication error", 401);
    } catch (err) {
      console.error(err);
      res.status(err.statusCode || 500).send(err);
    }
  },

  getAll: async function (req, res) {
    try {
      const allUsers = await User.find({});
      return res.send(allUsers);
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  },
};
