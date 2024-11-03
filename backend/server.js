// server.js
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node')
const connDB = require("./config/DB")
const Test = require("./models/test")
const TestResult = require("./models/testresult")
const crypto = require("crypto")

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connDB()

// CORS setup
const corsOptions = {
  origin: "https://excelitest.vercel.app",
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

// Middlewares
app.use(express.json())

// Clerk Auth Middleware
const requireAuth = ClerkExpressRequireAuth({
  // You can customize options here if needed
  onError: (err, req, res) => {
    res.status(401).json({
      success: false,
      message: "Unauthorized - Please sign in to continue",
    })
  }
})

// Helper functions remain the same
const generateTestCode = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase()
}

const isValidTestCode = (code) => {
  return /^[A-F0-9]{6}$/.test(code)
}

// Public routes (no auth required)
app.get("/", (req, res) => {
  res.send(`Server is running on port ${PORT}`)
})

app.get("/check", (req, res) => {
  res.send(`Server Running`)
})

// Get test by code (public route for test access)
app.get("/api/tests/code/:code", async (req, res) => {
  try {
    const { code } = req.params

    if (!isValidTestCode(code)) {
      return res.status(400).json({
        success: false,
        message: "Invalid test code format",
      })
    }

    const test = await Test.findOne({ testCode: code })

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      })
    }

    res.json({
      success: true,
      testId: test._id,
      link: `${process.env.FRONTEND_URL || "http://localhost:3000"}/attempt-test/${test._id}`,
    })
  } catch (error) {
    console.error("Error finding test by code:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

// Protected routes (auth required)
// Create test
app.post("/api/tests", requireAuth, async (req, res) => {
  try {
    let testCode
    let isUnique = false

    while (!isUnique) {
      testCode = generateTestCode()
      const existingTest = await Test.findOne({ testCode })
      if (!existingTest) {
        isUnique = true
      }
    }

    const testData = {
      ...req.body,
      testCode,
      createdAt: new Date(),
      testAdmin: req.auth.userId, // Add Clerk user ID as testAdmin
    }

    const newTest = new Test(testData)
    const savedTest = await newTest.save()

    const testLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/attempt-test/${savedTest._id}`

    res.status(201).json({
      message: "Test created successfully",
      test: savedTest,
      link: testLink,
      code: testCode,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error creating test", error })
  }
})

// Get tests for admin
app.get("/api/tests", requireAuth, async (req, res) => {
  try {
    const { testAdminEmail } = req.query

    // Verify the requesting user matches the testAdmin
    if (testAdminEmail !== req.auth.email) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized - You can only view your own tests"
      })
    }

    const tests = await Test.find({ testAdmin: testAdminEmail })
    res.status(200).json({ success: true, tests })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Error fetching test details",
      error: error.message,
    })
  }
})

// Get test details
app.get("/api/tests/:testId", requireAuth, async (req, res) => {
  try {
    const includeAnswers = req.query.includeAnswers === "true"
    const test = await Test.findById(req.params.testId)
      .populate({
        path: "questions",
        select: includeAnswers ? "" : "-CorrectAnswer",
      })
      .select("testName testAccessPeriod Subject Description totalMarks testCode")

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      })
    }

    // If including answers, verify the requesting user is the test admin
    if (includeAnswers && test.testAdmin !== req.auth.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized - Only test admin can view answers"
      })
    }

    const totalMarks = test.questions.reduce(
      (sum, question) => sum + question.Marks,
      0
    )

    const formattedTest = {
      test: {
        _id: test._id,
        testName: test.testName,
        testAccessPeriod: test.testAccessPeriod,
        Subject: test.Subject,
        Description: test.Description,
        testCode: test.testCode,
        totalMarks,
        questions: test.questions.map((q) => ({
          _id: q._id,
          QuestionText: q.QuestionText,
          OptionA: q.OptionA,
          OptionB: q.OptionB,
          OptionC: q.OptionC,
          OptionD: q.OptionD,
          Marks: q.Marks,
          ...(includeAnswers && { CorrectAnswer: q.CorrectAnswer }),
        })),
      },
    }

    res.json(formattedTest)
  } catch (error) {
    console.error("Error fetching test:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching test details",
      error: error.message,
    })
  }
})

// Submit test
app.post("/api/tests/:testId/submit", requireAuth, async (req, res) => {
  const { answers } = req.body

  try {
    const test = await Test.findById(req.params.testId)
    if (!test) return res.status(404).json({ message: "Test not found" })

    let score = 0
    const correctAnswers = []

    test.questions.forEach((question, index) => {
      const submittedAnswer = answers[index]
      const correctAnswer = question.CorrectAnswer.replace("Option", "")

      if (submittedAnswer === correctAnswer) {
        score += question.Marks
      }

      correctAnswers.push({
        questionId: question._id,
        selectedAnswer: submittedAnswer,
      })
    })

    const testResult = new TestResult({
      testId: req.params.testId,
      score: score,
      answers: correctAnswers,
      userId: req.auth.userId, // Use Clerk user ID
    })

    await testResult.save()

    res.json({
      message: "Test submitted successfully",
      score: score,
      resultId: testResult._id,
    })
  } catch (error) {
    console.error("Error submitting test:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get test results
app.get("/api/tests/:testId/results", requireAuth, async (req, res) => {
  try {
    const result = await TestResult.findOne({
      testId: req.params.testId,
      userId: req.auth.userId, // Only allow users to view their own results
    }).populate("testId", "testName Duration Subject testCode")

    if (!result)
      return res.status(404).json({ message: "Test result not found" })

    res.json({
      test: result.testId,
      score: result.score,
      answers: result.answers,
      submittedAt: result.submittedAt,
    })
  } catch (error) {
    console.error("Error fetching test results:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all results for tests created by a specific test admin
app.get("/api/admin/test-results", requireAuth, async (req, res) => {
  try {
    const { testAdminEmail } = req.query

    // Verify the requesting user matches the testAdmin
    if (testAdminEmail !== req.auth.email) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized - You can only view results for your own tests"
      })
    }

    const tests = await Test.find({ testAdmin: testAdminEmail })

    if (!tests || tests.length === 0) {
      return res.json({
        success: true,
        results: [],
        message: "No tests found for this admin",
      })
    }

    const testIds = tests.map((test) => test._id)

    const results = await TestResult.find({
      testId: { $in: testIds },
    })
      .populate({
        path: "testId",
        select: "testName testCode Subject Duration testAdmin",
      })
      .populate("userId", "name email")
      .sort({ submittedAt: -1 })

    const formattedResults = results.map((result) => ({
      resultId: result._id,
      testName: result.testId.testName,
      testCode: result.testId.testCode,
      subject: result.testId.Subject,
      duration: result.testId.Duration,
      studentEmail: result.userId,
      score: result.score,
      submittedAt: result.submittedAt,
    }))

    res.json({
      success: true,
      count: formattedResults.length,
      results: formattedResults,
    })
  } catch (error) {
    console.error("Error fetching test results:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching test results",
      error: error.message,
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
