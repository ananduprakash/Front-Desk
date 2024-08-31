import express from 'express';
import {
  createBill,
  markBillAsPaid
} from '../controllers/billController.js';

const router = express.Router();

// Create New Bill
router.post('/', createBill);

// Mark Bill as Paid
router.put('/:id/pay', markBillAsPaid);

export default router;
