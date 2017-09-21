const models = require('../models');
const Promise = require('bluebird');
const utils = require('../lib/hashUtils');

module.exports.createSession = (req, res, next) => {
  let hash = req.cookies.shortlyid;
  return models.Sessions.get({hash: hash})
    .then(session => {
      if (session) {
        throw session;
      }
    })
    .then(() => models.Sessions.create())
    .then(insertion => {
      return models.Sessions.get({id: insertion.insertId})
        .then(session => {
          throw session;
        });
    })
    .catch(session => {
      req.session = session;
      res.cookie('shortlyid', {value: session.hash});
      res.cookies = {
        shortlyid: {
          value: session.hash
        }
      };
      next();
    });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

