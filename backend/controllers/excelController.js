// Updated code by  GPT
const xlsx = require('xlsx');
const multer = require('multer');
const path = require('path');
const { Test } = require('../models/Test');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only Excel files are allowed.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const processExcelFile = async (filePath) => {
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Validate and transform data
        const questions = data.map((row, index) => {
            if (!row['QuestionText'] || !row['OptionA'] || !row['OptionB'] || 
                !row['OptionC'] || !row['OptionD'] || !row['CorrectAnswer']) {
                throw new Error(`Invalid data in row ${index + 1}`);
            }

            // Validate correct answer is one of A, B, C, or D
            const correctAnswer = row['CorrectAnswer'].toUpperCase();
            if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
                throw new Error(`Invalid correct answer in row ${index + 1}`);
            }

            return {
                questionText: row['QuestionText'],
                options: {
                    A: row['OptionA'],
                    B: row['OptionB'],
                    C: row['OptionC'],
                    D: row['OptionD']
                },
                correctAnswer: correctAnswer,
                marks: row['Marks'] || 1
            };
        });

        return questions;
    } catch (error) {
        throw new Error(`Error processing Excel file: ${error.message}`);
    }
};

const createTestFromExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const questions = await processExcelFile(req.file.path);

        const test = new Test({
            name: req.body.testName, // Get test name from request body
            questions: questions,
            timeLimit: req.body.timeLimit || 60 // Get time limit from request body
        });

        await test.save ();

        res.status(201).json({
            message: 'Test created successfully',
            testId: test._id,
            questionCount: questions.length
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    upload,
    createTestFromExcel
};

// const xlsx = require('xlsx');
// const multer = require('multer');
// const path = require('path');
// const { Test } = require('../models/Test')

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// const fileFilter = (req, file, cb) => {
//     const allowedTypes = [
//       'application/vnd.ms-excel',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//     ];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Invalid file type. Only Excel files are allowed.'));
//     }
//   };
  
//   const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
//   });
  

//   const processExcelFile = async (filePath) => {
//     try {
//       const workbook = xlsx.readFile(filePath);
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       const data = xlsx.utils.sheet_to_json(worksheet);
  
//       // Validate and transform data
//       const questions = data.map((row, index) => {
//         if (!row['Question Text'] || !row['Option A'] || !row['Option B'] || 
//             !row['Option C'] || !row['Option D'] || !row['Correct Answer']) {
//           throw new Error(`Invalid data in row ${index + 1}`);
//         }
  
//         // Validate correct answer is one of A, B, C, or D
//         const correctAnswer = row['Correct Answer'].toUpperCase();
//         if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
//           throw new Error(`Invalid correct answer in row ${index + 1}`);
//         }
  
//         return {
//           questionText: row['Question Text'],
//           options: {
//             A: row['Option A'],
//             B: row['Option B'],
//             C: row['Option C'],
//             D: row['Option D']
//           },
//           correctAnswer: correctAnswer,
//           marks: row['Marks'] || 1
//         };
//       });
  
//       return questions;
//     } catch (error) {
//       throw new Error(`Error processing Excel file: ${error.message}`);
//     }
//   };

//   const createTestFromExcel = async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ message: 'No file uploaded' });
//       }
  
//       const questions = await processExcelFile(req.file.path);
  
//       const test = new Test({
//         name: req.body.testName,
//         questions: questions,
//         timeLimit: req.body.timeLimit || 60
//       });
  
//       await test.save();
  
//       res.status(201).json({
//         message: 'Test created successfully',
//         testId: test._id,
//         questionCount: questions.length
//       });
  
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   };


//   module.exports = {
//     upload,
//     createTestFromExcel
//   };