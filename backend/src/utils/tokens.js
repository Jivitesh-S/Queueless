import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, branchId: user.branchId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });

export const buildTokenNumber = (prefix, sequence) =>
  `${prefix || 'QL'}-${String(sequence).padStart(3, '0')}`;
