require('dotenv').config()
const mongoose = require('mongoose');

const connDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/excelitest');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connDB;