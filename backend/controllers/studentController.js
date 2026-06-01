const Student = require('../models/Student');
const fs = require('fs');
const path = require('path');

// Helper to delete locally saved upload files
const deleteLocalPhoto = (photoPath) => {
  if (photoPath && photoPath.startsWith('/uploads/')) {
    const fullPath = path.join(__dirname, '..', photoPath);
    fs.unlink(fullPath, (err) => {
      if (err) console.error(`Failed to delete local photo at ${fullPath}:`, err.message);
    });
  }
};

// @desc    Get all students (with search, filter, pagination)
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res) => {
  try {
    const { search, branch, semester, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = {};

    // 1. Search Query (matches Full Name, Student ID, Email, Phone)
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // 2. Branch Filter
    if (branch && branch !== 'All') {
      query.branch = branch;
    }

    // 3. Semester Filter
    if (semester && semester !== 'All') {
      query.semester = Number(semester);
    }

    // Pagination calculations
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sorting parameters
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Query DB
    const students = await Student.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const totalStudents = await Student.countDocuments(query);

    return res.json({
      success: true,
      count: students.length,
      pagination: {
        total: totalStudents,
        pages: Math.ceil(totalStudents / limitNum),
        currentPage: pageNum,
        limit: limitNum,
      },
      data: students,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single student by DB ID or custom Student ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    return res.json({ success: true, data: student });
  } catch (error) {
    console.error(error);
    // If invalid cast ID, check by custom student ID
    try {
      const studentByCustomId = await Student.findOne({ studentId: req.params.id.toUpperCase() });
      if (studentByCustomId) {
        return res.json({ success: true, data: studentByCustomId });
      }
    } catch (e) {
      // Ignore inner catch and error out with main failure
    }
    return res.status(500).json({ success: false, message: 'Invalid Student identifier' });
  }
};

// @desc    Create a new student
// @route   POST /api/students
// @access  Private
const createStudent = async (req, res) => {
  try {
    const { studentId, fullName, email, phone, branch, semester, address, profilePhoto } = req.body;

    // Validate if Student ID exists
    const idExists = await Student.findOne({ studentId: studentId.toUpperCase() });
    if (idExists) {
      // Clean up uploaded file if validation failed
      if (req.file) deleteLocalPhoto(`/uploads/${req.file.filename}`);
      return res.status(400).json({ success: false, message: `Student ID '${studentId}' already exists` });
    }

    // Validate if Email exists
    const emailExists = await Student.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      if (req.file) deleteLocalPhoto(`/uploads/${req.file.filename}`);
      return res.status(400).json({ success: false, message: `Email '${email}' is already registered` });
    }

    let photo = profilePhoto || '';
    if (req.file) {
      photo = `/uploads/${req.file.filename}`;
    }

    const student = await Student.create({
      studentId: studentId.toUpperCase(),
      fullName,
      email: email.toLowerCase(),
      phone,
      branch,
      semester: Number(semester),
      address,
      profilePhoto: photo,
    });

    return res.status(201).json({ success: true, data: student });
  } catch (error) {
    console.error(error);
    if (req.file) deleteLocalPhoto(`/uploads/${req.file.filename}`);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update an existing student
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = async (req, res) => {
  try {
    const { studentId, fullName, email, phone, branch, semester, address, profilePhoto } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      if (req.file) deleteLocalPhoto(`/uploads/${req.file.filename}`);
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // If student ID is changing, verify unique constraint
    if (studentId && studentId.toUpperCase() !== student.studentId) {
      const idExists = await Student.findOne({ studentId: studentId.toUpperCase() });
      if (idExists) {
        if (req.file) deleteLocalPhoto(`/uploads/${req.file.filename}`);
        return res.status(400).json({ success: false, message: `Student ID '${studentId}' is taken` });
      }
      student.studentId = studentId.toUpperCase();
    }

    // If email is changing, verify unique constraint
    if (email && email.toLowerCase() !== student.email) {
      const emailExists = await Student.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        if (req.file) deleteLocalPhoto(`/uploads/${req.file.filename}`);
        return res.status(400).json({ success: false, message: `Email '${email}' is taken` });
      }
      student.email = email.toLowerCase();
    }

    // Apply updates
    if (fullName) student.fullName = fullName;
    if (phone) student.phone = phone;
    if (branch) student.branch = branch;
    if (semester) student.semester = Number(semester);
    if (address) student.address = address;

    // Handle profile photo updates
    if (req.file) {
      // Delete old photo if it was locally uploaded
      deleteLocalPhoto(student.profilePhoto);
      student.profilePhoto = `/uploads/${req.file.filename}`;
    } else if (profilePhoto !== undefined) {
      // If photo was cleared or changed via text URL
      if (profilePhoto === '') {
        deleteLocalPhoto(student.profilePhoto);
      }
      student.profilePhoto = profilePhoto;
    }

    const updatedStudent = await student.save();
    return res.json({ success: true, data: updatedStudent });
  } catch (error) {
    console.error(error);
    if (req.file) deleteLocalPhoto(`/uploads/${req.file.filename}`);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a student record
// @route   DELETE /api/students/:id
// @access  Private
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Delete local photo
    deleteLocalPhoto(student.profilePhoto);

    await student.deleteOne();
    return res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard metrics & aggregations
// @route   GET /api/students/stats/summary
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Student Count
    const totalStudents = await Student.countDocuments();

    // 2. Count by branch
    const branchStats = await Student.aggregate([
      { $group: { _id: '$branch', count: { $sum: 1 } } },
      { $project: { branch: '$_id', count: 1, _id: 0 } },
    ]);

    // 3. Count by semester
    const semesterStats = await Student.aggregate([
      { $group: { _id: '$semester', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { semester: '$_id', count: 1, _id: 0 } },
    ]);

    // 4. Recently Added Students (limit to 5)
    const recentlyAdded = await Student.find()
      .sort({ createdAt: -1 })
      .limit(5);

    return res.json({
      success: true,
      data: {
        totalStudents,
        branchStats,
        semesterStats,
        recentlyAdded,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getDashboardStats,
};
