import express from 'express';
import {
  createUser,
  loginUser,
  logoutUser,
  listUsers,
  getUserBills,
  vacateUser
} from '../controllers/userController.js';

const router = express.Router();

// Create User
router.post('/', createUser);

// Login
router.post('/login', loginUser);

// Logout
router.post('/logout', logoutUser);

// List Users
router.get('/', listUsers);

// User Details and Bills
router.get('/:id/bills', getUserBills);

// Vacate User
router.put('/:id/vacate', vacateUser);

export default router;
