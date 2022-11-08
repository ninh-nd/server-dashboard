import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const data = jwt.verify(token, process.env.JWT_SECRET);
  // TODO...
};
