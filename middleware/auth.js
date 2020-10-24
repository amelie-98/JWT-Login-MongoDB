import jwt from 'jsonwebtoken';

require('dotenv').config();

const secret_key = process.env.SECRET_KEY;

export default (req, res, next) => {
  const authHeader = req.headers.authorization;
  const err = new Error();
  err.status = 403;
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];
    if (token) {
      try {
        const user = jwt.verify(token, secret_key);
        req.user = user;
        return next();
      } catch (err) {
        err.message = 'invalid/expired token';
        return next(err);
      }
    }
    //nếu đằng sau chữ Bearer không có gì cả
    err.message = 'authoriation token must be Bearer [token]';
    return next(err);
  }
  //nếu không có header
  err.message = 'authorization header must be provided';
  return next(err);
};
