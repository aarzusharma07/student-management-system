const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Student = require('../models/Student');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const defaultAdmin = {
  username: 'admin',
  email: 'admin@school.com',
  password: 'admin123',
  name: 'System Administrator',
  role: 'admin',
};

const defaultStudents = [
  {
    studentId: 'STU2026001',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@school.edu',
    phone: '+919876543210',
    branch: 'CSE',
    semester: 6,
    address: 'Sector 62, Noida, UP, India',
    profilePhoto: '',
  },
  {
    studentId: 'STU2026002',
    fullName: 'Ananya Goel',
    email: 'ananya.goel@school.edu',
    phone: '+918765432109',
    branch: 'CSE',
    semester: 4,
    address: 'DLF Phase 3, Gurgaon, Haryana, India',
    profilePhoto: '',
  },
  {
    studentId: 'STU2026003',
    fullName: 'Rohan Verma',
    email: 'rohan.verma@school.edu',
    phone: '+917654321098',
    branch: 'ECE',
    semester: 6,
    address: 'Rohini Sector 9, New Delhi, India',
    profilePhoto: '',
  },
  {
    studentId: 'STU2026004',
    fullName: 'Meera Nair',
    email: 'meera.nair@school.edu',
    phone: '+916543210987',
    branch: 'IT',
    semester: 8,
    address: 'Kochi, Kerala, India',
    profilePhoto: '',
  },
  {
    studentId: 'STU2026005',
    fullName: 'Kabir Malhotra',
    email: 'kabir.malhotra@school.edu',
    phone: '+915432109876',
    branch: 'ME',
    semester: 2,
    address: 'Andheri West, Mumbai, Maharashtra, India',
    profilePhoto: '',
  },
  {
    studentId: 'STU2026006',
    fullName: 'Riya Sen',
    email: 'riya.sen@school.edu',
    phone: '+914321098765',
    branch: 'CE',
    semester: 5,
    address: 'Salt Lake Sector 5, Kolkata, WB, India',
    profilePhoto: '',
  },
  {
    studentId: 'STU2026007',
    fullName: 'Devansh Joshi',
    email: 'devansh.joshi@school.edu',
    phone: '+913210987654',
    branch: 'EE',
    semester: 3,
    address: 'Jayanagar, Bangalore, Karnataka, India',
    profilePhoto: '',
  },
  {
    studentId: 'STU2026008',
    fullName: 'Sneha Rao',
    email: 'sneha.rao@school.edu',
    phone: '+912109876543',
    branch: 'IT',
    semester: 4,
    address: 'Gachibowli, Hyderabad, Telangana, India',
    profilePhoto: '',
  },
  {
    studentId: 'STU2026009',
    fullName: 'Aditya Gupta',
    email: 'aditya.gupta@school.edu',
    phone: '+919123456789',
    branch: 'CSE',
    semester: 8,
    address: 'Patel Nagar, Dehradun, Uttarakhand, India',
    profilePhoto: '',
  },
  {
    studentId: 'STU2026010',
    fullName: 'Isha Patel',
    email: 'isha.patel@school.edu',
    phone: '+918234567890',
    branch: 'ECE',
    semester: 2,
    address: 'Satellite, Ahmedabad, Gujarat, India',
    profilePhoto: '',
  },
  {
    studentId: 'STU2026011',
    fullName: 'Vikram Singh',
    email: 'vikram.singh@school.edu',
    phone: '+917345678901',
    branch: 'ME',
    semester: 7,
    address: 'Vaishali Nagar, Jaipur, Rajasthan, India',
    profilePhoto: '',
  },
  {
    studentId: 'STU2026012',
    fullName: 'Tanvi Mishra',
    email: 'tanvi.mishra@school.edu',
    phone: '+916456789012',
    branch: 'CE',
    semester: 6,
    address: 'Gomti Nagar, Lucknow, UP, India',
    profilePhoto: '',
  },
  {
    studentId: 'STU2026013',
    fullName: 'Siddharth Bose',
    email: 'siddharth.bose@school.edu',
    phone: '+915567890123',
    branch: 'EE',
    semester: 5,
    address: 'Kalyani, West Bengal, India',
    profilePhoto: '',
  },
  {
    studentId: 'STU2026014',
    fullName: 'Kriti Deshmukh',
    email: 'kriti.deshmukh@school.edu',
    phone: '+914678901234',
    branch: 'CSE',
    semester: 1,
    address: 'Kothrud, Pune, Maharashtra, India',
    profilePhoto: '',
  },
  {
    studentId: 'STU2026015',
    fullName: 'Varun Reddy',
    email: 'varun.reddy@school.edu',
    phone: '+913789012345',
    branch: 'ECE',
    semester: 4,
    address: 'Vizag, Andhra Pradesh, India',
    profilePhoto: '',
  },
  {
    studentId: 'STU2026016',
    fullName: 'Nehal Mehta',
    email: 'nehal.mehta@school.edu',
    phone: '+912890123456',
    branch: 'IT',
    semester: 7,
    address: 'Race Course, Coimbatore, Tamil Nadu, India',
    profilePhoto: '',
  }
];

const seedDB = async () => {
  try {
    // Connect DB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/student-management-db');
    console.log('Seed: Connected to Database...');

    // Clear DB
    await User.deleteMany({});
    console.log('Seed: Cleared existing Users.');
    await Student.deleteMany({});
    console.log('Seed: Cleared existing Students.');

    // Seed Admin (hashes password automatically via pre-save hook)
    const admin = await User.create(defaultAdmin);
    console.log(`Seed: Admin user created [Username: ${admin.username}, Password: admin123]`);

    // Seed Students
    const students = await Student.insertMany(defaultStudents);
    console.log(`Seed: Successfully seeded ${students.length} student records.`);

    // Close Connection
    mongoose.connection.close();
    console.log('Seed: Database seeding completed. Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
