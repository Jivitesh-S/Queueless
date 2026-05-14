import User from '../models/User.js';
import { AppError, asyncHandler } from '../utils/errors.js';
import { signToken } from '../utils/tokens.js';

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  branchId: user.branchId
});

export const signup = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ user: publicUser(user), token: signToken(user) });
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new AppError('Invalid email or password', 401);
  }
  res.json({ user: publicUser(user), token: signToken(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});
