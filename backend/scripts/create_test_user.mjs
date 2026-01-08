import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import mongoose from 'mongoose';
import CryptoJS from 'crypto-js';
import { genSalt, hash } from 'bcryptjs';
import User from '../models/User.js';

const CLIENT_SECRET = "6a48b6d8e895dbc8dde56195a4aeca4286f7c88a8bf6eb37b4e45e4177555bc1";

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'test' });
    console.log('Connected to MongoDB');

    const plainPassword = 'TestPass123!';
    const clientHashed = CryptoJS.SHA256(plainPassword + CLIENT_SECRET).toString();
    const salt = await genSalt(10);
    const serverHash = await hash(clientHashed, salt);

    const encryptedDesc = CryptoJS.AES.encrypt('This is a test description', process.env.ENC_KEY).toString();

    const user = new User({
      full_name: 'Test User',
      username: `testuser_${Date.now()}`,
      email: `testuser_${Date.now()}@example.com`,
      age: 30,
      birthdate: new Date('1996-01-01'),
      password: serverHash,
      school: 'Test University',
      description_enc: encryptedDesc
    });

    const saved = await user.save();
    console.log('User saved with id:', saved._id.toString());

    // fetch back and show decrypted description
    const fetched = await User.findById(saved._id);
    console.log('Decrypted description:', fetched.getDecryptedDescription());

    await mongoose.disconnect();
    console.log('Disconnected');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

run();
