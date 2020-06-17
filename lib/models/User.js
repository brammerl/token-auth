const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true,
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret.passwordHash;
    }
  }
});

schema.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, + process.env.SALT_ROUNDS || 8);
});

schema.statics.authorizeUser = function(email, password) {
  return this.findOne({ email })
    .then(user => {
      if(!user) {
        throw new Error('Invalid email!');
      }

      if(!bcrypt.compareSync(password, user.passwordHash)) {
        throw new Error('Invalid password');
      }

      return user;
    });
};

schema.statics.verifyToken = function(token) {
  const { sub } = jwt.verify(token, process.env.APP_SECRET);

  return this.hydrate(sub);
};

schema.methods.authorizeToken = function() {
  return jwt.sign({ sub: this.toJSON() }, process.env.APP_SECRET, { expiresIn: '24h' });
};


module.exports = mongoose.model('User', schema);
