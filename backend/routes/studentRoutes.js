const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getDashboardStats,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Secure all routes with JWT check
router.use(protect);

// Dashboard statistics
router.get('/stats/summary', getDashboardStats);

// Base student collection endpoints
router.route('/')
  .get(getStudents)
  .post(authorize('admin'), upload.single('profilePhoto'), createStudent);

// Parametrized student endpoints
router.route('/:id')
  .get(getStudentById)
  .put(authorize('admin'), upload.single('profilePhoto'), updateStudent)
  .delete(authorize('admin'), deleteStudent);

module.exports = router;
