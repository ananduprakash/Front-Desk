import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Bill from '../models/Bill.js';

const JWT_SECRET = 'frontdesk';

// Create User
export const createUser = async (req, res) => {
  try {
    const { name, role, password } = req.body;

    if (!name || !role || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, role, password: hashedPassword });
    await user.save();

    const bill = new Bill({
      amount: 100,
      dueDate: new Date(),
      status: 'pending',
      userId: user._id,
      billType: 'security',
    });
    await bill.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user,
      bill,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Missing username or password' });
    }

    const user = await User.findOne({ name: username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
     
      
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ success: true, message: 'Login successful', token });
  } catch (error) {
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Logout
export const logoutUser = (req, res) => {
  res.json({ success: true, message: 'Logout successful' });
};

// List Users
export const listUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// User Details and Bills
export const getUserBills = async (req, res) => {
  try {
    const { id } = req.params;
    const bills = await Bill.find({ userId: id });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Vacate User
export const vacateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const bills = await Bill.find({ userId: id });
    const totalPaid = bills.filter(bill => bill.status === 'paid').reduce((sum, bill) => sum + bill.amount, 0);
    const totalUnpaid = bills.filter(bill => bill.status === 'pending').reduce((sum, bill) => sum + bill.amount, 0);
    const refund = bills.filter(bill => bill.billType === 'security' && bill.status === 'paid').reduce((sum, bill) => sum + bill.amount, 0);

    user.status = 'vacated';
    await user.save();

    res.json({
      success: true,
      message: 'User vacated successfully',
      paidBills: totalPaid,
      unpaidBills: totalUnpaid,
      refund
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
