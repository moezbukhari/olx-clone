const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Users = mongoose.models.Users || mongoose.model('Users', {
  username: String,
  password: String,
  contact: String,
  gmail: String,
  LikedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }]
});

module.exports.signup = (req, res) => {
  const { username, password, contact, gmail } = req.body;
  const user = new Users({ username, password, contact, gmail });

  user.save()
    .then(() => res.send({ message: 'saved success.' }))
    .catch(() => res.send({ message: 'server err' }));
};

module.exports.login = (req, res) => {
  const { username, password } = req.body;

  Users.findOne({ username })
    .then((result) => {
      if (!result) {
        return res.send({ message: 'User not found.' });
      }
      if (result.password !== password) {
        return res.send({ message: 'password wrong.' });
      }

      const token = jwt.sign({ data: result }, 'MYKEY', { expiresIn: '1h' });
      res.send({ message: 'find success.', token, userId: result._id });
    })
    .catch(() => res.send({ message: 'server err' }));
};

module.exports.getUser = (req, res) => {
  Users.findById(req.params.uId)
    .then((result) => {
      if (!result) {
        return res.status(404).send({ message: 'User not found.' });
      }
      res.send({ message: 'success', user: result });
    })
    .catch(() => res.status(400).send({ message: 'Invalid user id.' }));
};
