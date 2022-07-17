import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const token = req.headers['x-access-token'] || req.headers.authorization;
  if (!token) {
    return res.status(401).send({ message: 'No token provided' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Failed to authenticate token' });
    }
    req.userId = decoded.id;
    return next();
  });
  return next();
}
