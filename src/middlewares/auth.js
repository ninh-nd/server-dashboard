import { errorResponse } from '../utils/responseFormat';

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).send(errorResponse('Unauthorized'));
}

export default checkAuth;
