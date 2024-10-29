const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  testAdmin:{
    type:String,
    required: false
  },
  testName: {
    type: String,
    required: true
  }, 
  testCode: {
    type: String,
    required: true,
    unique: true,
    length: 6
  },
  numberOfAttempts: {
    type: Number,
    default: 1
  },
  questionRandomization: {
    type: Boolean,
    default: false
  },
  testAccessPeriod: {
    type: String,
    required: true
  },
  questions: [{
    QuestionText: String,
    OptionA: String,
    OptionB: String,
    OptionC: String,
    OptionD: String,
    CorrectAnswer: String,
    Marks: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Test', TestSchema);