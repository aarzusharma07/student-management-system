const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [
        /^\+?[0-9]{7,15}$/,
        'Please provide a valid phone number (7-15 digits)',
      ],
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      enum: {
        values: ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT'],
        message: '{VALUE} is not a valid branch',
      },
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: [1, 'Semester cannot be less than 1'],
      max: [8, 'Semester cannot exceed 8'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    profilePhoto: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Student', StudentSchema);
