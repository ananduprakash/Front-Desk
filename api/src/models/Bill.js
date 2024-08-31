import { Schema, model } from 'mongoose';

const billSchema = new Schema({
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['paid', 'pending'], default: 'pending' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  billType: { type: String, enum: ['security', 'other'], required: true }
});

const Bill = model('Bill', billSchema);
export default Bill;
