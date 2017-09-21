const models = require('../models');
const Promise = require('bluebird');
const utils = require('../lib/hashUtils');

module.exports.createSession = (req, res, next) => {
  // retrieve sessionHash from cookies, can be one of:
  // - a valid hash (have corresponding session in db)
  // - a malicious hash (no corresponding session in db)
  // - undefined (first-time visitor)
  let hash = req.cookies.shortlyid;
  // get corresponding session object from db
  return models.Sessions.get({hash: hash})
    .then(session => {
      if (session) {
        // if a valid session is found, 
        // 'throw' it forward and skip below 'then' blocks
        throw session;
      }
    })
    // if no valid session is found, create one
    .then(() => models.Sessions.create())
    // retrieve the new valid session ...
    .then(insertion => {
      return models.Sessions.get({id: insertion.insertId});
    })
    // ... and 'throw' it forward
    .then(session => {
      throw session;
    })
    // 'catch' the valid session, and set its hash in the cookie
    .catch(session => {
      req.session = session;
      res.cookie('shortlyid', session.hash);
      next();
    });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

