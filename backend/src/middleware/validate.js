import { AppError } from '../utils/errors.js';

export const requireFields = (...fields) => (req, _res, next) => {
  const missing = fields.filter((field) => req.body[field] === undefined || req.body[field] === '');
  if (missing.length) throw new AppError('Missing required fields', 400, { missing });
  next();
};
