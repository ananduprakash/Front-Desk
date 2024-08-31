import Bill from '../models/Bill.js';

// Create New Bill
export const createBill = async (req, res) => {
  try {
    const { amount, dueDate, status, userId, billType } = req.body;

    const bill = new Bill({ amount, dueDate, status, userId, billType });
    await bill.save();

    res.status(201).json({ success: true, message: 'Bill created successfully', bill });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Mark Bill as Paid
export const markBillAsPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await Bill.findByIdAndUpdate(id, { status: 'paid' }, { new: true });
    res.json({ success: true, message: 'Bill marked as paid', bill });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
