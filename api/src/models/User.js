import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'tenant'], required: true },
  status: { type: String, enum: ['active', 'vacated'], default: 'active' },
  password: { type: String, required: true },
});

const User = model('User', userSchema);
export default User;
