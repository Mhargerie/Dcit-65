import mongoose from 'mongoose'
import CryptoJS from 'crypto-js'


const UserSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true }, // Added for standard practice
  age: { type: Number, required: true },
  birthdate: { type: Date, required: true },
  password: { type: String, required: true }, // Will store bcrypt hash of client-hash
  school: { type: String, default: '' },
  
  // [cite_start]// ENCRYPTED FIELD [cite: 11]
  // We store the description as an encrypted string (ciphertext)
  description_enc: { type: String, default: '' }, 
  
  progress: {
    completed_lessons: [String],
    lessons_in_progress: [String],
    streak: { type: Number, default: 0 }
  },
  
  // Security Logs
  login_attempts: { type: Number, default: 0 },
  lock_until: { type: Number }
});

// Helper to decrypt description when sending to frontend
UserSchema.methods.getDecryptedDescription = function() {
  if (!this.description_enc) return '';
  const bytes = CryptoJS.AES.decrypt(this.description_enc, process.env.ENC_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export default mongoose.model('User', UserSchema);