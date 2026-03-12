import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Public Routes (no token required) ---
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- Private Routes (JWT required) ---
// Get logged-in user's own profile
router.get('/me', authMiddleware, getMe);

// Admin-level routes (also protected)
router.get('/', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

export default router;