const jwt = require('jsonwebtoken');
const Config = require('config');

const configSecret = Config.get("secret").secret;

const checkToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization'];

  if (token) {
    jwt.verify(token, configSecret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

module.exports = {
  checkToken: checkToken
}