import mongoose from 'mongoose';
import { connectDb } from '../config/db.js';
import Analytics from '../models/Analytics.js';
import Department from '../models/Department.js';
import Notification from '../models/Notification.js';
import Queue from '../models/Queue.js';
import Token from '../models/Token.js';
import User from '../models/User.js';

const seed = async () => {
  await connectDb();
  await Promise.all([
    Analytics.deleteMany({}),
    Notification.deleteMany({}),
    Token.deleteMany({}),
    Queue.deleteMany({}),
    Department.deleteMany({}),
    User.deleteMany({})
  ]);

  const departments = await Department.insertMany([
    { name: 'General Medicine', code: 'GM', averageServiceTime: 9 },
    { name: 'Diagnostics', code: 'DX', averageServiceTime: 6 },
    { name: 'Citizen Services', code: 'CS', averageServiceTime: 11 }
  ]);

  await User.create([
    { name: 'QueueLess Admin', email: 'admin@queueless.app', password: 'Password123!', role: 'admin' },
    { name: 'Front Desk Staff', email: 'staff@queueless.app', password: 'Password123!', role: 'staff', department: departments[0]._id }
  ]);

  await Queue.insertMany([
    { name: 'OPD Walk-ins', department: departments[0]._id, prefix: 'OPD', averageServiceTime: 9 },
    { name: 'Lab Samples', department: departments[1]._id, prefix: 'LAB', averageServiceTime: 6 },
    { name: 'Document Counter', department: departments[2]._id, prefix: 'DOC', averageServiceTime: 11 }
  ]);

  console.log('Seed data created without preloaded queue visitors');
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
