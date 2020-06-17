const { Router } = require('express');
const ensureAuth = require('../middleware/ensureAuth');
const Membership = require('../models/Membership');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Membership
      .create(req.body)
      .then(membership => res.send(membership))
      .catch(next);
  })

  .get('/', ensureAuth, (req, res, next) => {
    Membership
      .find(req.query)
      .populate('organization', {
        _id: true,
        title: true,
        imageUrl: true
      })
      .populate('user', {
        _id: true,
        email: true
      })
      .then(membership => res.send(membership))
      .catch(next);
  });
