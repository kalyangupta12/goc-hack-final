// models/testresult.js
const mongoose = require('mongoose');

const TestResultSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
  },
  userId: {
    type: String,
    // ref: 'User',
    required: false, // Assuming you have user authentication
  },
  score: {
    type: Number,
    required: true,
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
      },
      selectedAnswer: {
        type: String,
        required: true,
      },
    },
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('TestResult', TestResultSchema);


// const mongoose = require('mongoose');

// const TestResultSchema = new mongoose.Schema({
//   testId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Test',
//     required: true,
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: false, // Assuming you have user authentication
//   },
//   score: {
//     type: Number,
//     required: true,
//   },
//   answers: [
//     {
//       questionId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Question',
//         required: true,
//       },
//       selectedAnswer: {
//         type: String,
//         required: true,
//       },
//       correctAnswer: { // Store the correct answer for review
//         type: String,
//         required: true,
//       },
//     },
//   ],
//   submittedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model('TestResult', TestResultSchema);
