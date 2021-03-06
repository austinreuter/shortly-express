const parseCookies = (req, res, next) => {
  if (!req.cookies) {
    req.cookies = {};
  }
  if (req.headers.cookie) {
    // split into array of (cookie) name-value pairs (e.g. 'id=123')
    let cookies = req.headers.cookie.split('; ');
    cookies.forEach(cookie => {
      let tuple = cookie.split('=');
      req.cookies[tuple[0]] = tuple[1];
    });
  }
  next();
};

module.exports = parseCookies;