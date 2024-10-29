// Updated by GPT
const express = require('express');
const router = express.Router();
const { Test } = require('../models/Test');
const { upload, createTestFromExcel } = require('../controllers/excelController');

// Create test from Excel file
router.post('/create-test', upload.single('file'), createTestFromExcel);

// View all tests
router.get('/view-test', async (req, res) => {
    try {
        const tests = await Test.find();
        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const { Test } = require('../models/Test');
// const { upload, createTestFromExcel } = require('../controllers/excelController')

// router.post('/create-test', upload.single('file'), createTestFromExcel);

// router.get('/view-test', async(req, res)=>{
//     try{
//         const tests = await Test.find();
//         res.json(tests);
//     }catch(error){
//         res.status(500).json({message: 'Server Error'});
//     }
// })