const User = require("../models/users")
const bcrypt = require('bcrypt')
const HttpError = require("../HttpError")

module.exports = {
  add: async function(req, res) {
    try {
      const { name, password } = req.body
      const user = new User({ name, password })

      const result = await user.save()
      res.status(201).send(result)
    } catch (err) {
      console.error(err)
      res.send(500).send(err)
    }
  },

  login: async function(req, res) {
    try {
      const { name, password } = req.body

      const user = await User.findOne({ name })

      if (! user) {
        throw new HttpError("User not found", 404)
      }

      const isSamePassword = await bcrypt.compare(password, user.password);

      if (isSamePassword) {
        return res.send(user)
      }

      throw new HttpError("Authentication error", 401)
    } catch (err) {
      console.error(err)
      res.status(err.statusCode || 500).send(err)
    }
  },
};
