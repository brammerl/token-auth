require('dotenv').config();

const User = require('./User');

describe('User model', () => {
  it('sets a password hash', () => {
    const user = new User({
      email: 'test@gmail.com',
      password: 'testpw',
    });

    expect(user.passwordHash).toEqual(expect.any(String));
  });

  it('has an authToken method', () => {
    const user = new User({
      email: 'test@gmail.com',
      password: 'testpw',
    });

    expect(user.authorizeToken()).toEqual(expect.any(String));
  });

  it('can verify token/return user', () => {
    const user = new User({
      email: 'test@gmail.com',
      password: 'testpw',
    });

    const token = user.authorizeToken();
    const verifiedUser = User.verifyToken(token);

    expect(verifiedUser.toJSON()).toEqual(user.toJSON());
  });
});


