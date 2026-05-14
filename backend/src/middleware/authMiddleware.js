import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { AppError, asyncHandler } from '../utils/errors.js';

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) throw new AppError('Authentication required', 401);

  const decoded = jwt.verify(header.split(' ')[1], env.jwtSecret);
  const user = await User.findById(decoded.id).select('-password');
  if (!user || !user.isActive) throw new AppError('User not found or inactive', 401);

  req.user = user;
  next();
});

export const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) throw new AppError('Insufficient permissions', 403);
  next();
};
