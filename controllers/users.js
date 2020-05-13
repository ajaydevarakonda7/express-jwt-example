const User = require("../models/users")
const bcrypt = require('bcrypt')

module.exports = {
  add: async function(req, res) {
    try {
      const { name, password } = req.body
      const user = new User({ name, password }) // document = instance of a model

      // TODO: We can hash the password here before we insert instead of in the model
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
      const something = await bcrypt.compare(password, user.password);
      console.log(something);

      res.send('hello there!')
    } catch (err) {
      console.error(err)
      res.send(500).send(err)
    }
  },
};
