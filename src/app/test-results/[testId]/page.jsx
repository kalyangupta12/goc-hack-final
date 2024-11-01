// test-results/[testId]/page.jsx

"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { toast } from "react-hot-toast"

const TestResults = () => {
  const params = useParams()
  const testId = params.testId
  const [results, setResults] = useState(null)
  const [test, setTest] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const [testResponse, resultsResponse] = await Promise.all([
          axios.get(
            process.env.NEXT_PUBLIC_API_URL +
              `/api/tests/${testId}?includeAnswers=true`
          ),
          axios.get(
            process.env.NEXT_PUBLIC_API_URL + `/api/tests/${testId}/results`
          ),
        ])
        setTest(testResponse.data.test)
        setResults(resultsResponse.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching results:", error)
        toast.error("Failed to load test results")
        setLoading(false)
      }
    }

    if (testId) fetchResults()
  }, [testId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading results...</p>
      </div>
    )
  }

  if (!test || !results) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-red-500">Failed to load test results</p>
      </div>
    )
  }

  const totalQuestions = test.questions.length
  const correctAnswers = results.answers.filter(
    (answer, index) =>
      answer.selectedAnswer === test.questions[index].CorrectAnswer
  ).length

  const totalMarks = test.questions.reduce((sum, q) => sum + (q.Marks || 0), 0)
  const percentage = ((results.score / totalMarks) * 100).toFixed(2)
  const passingScore = 40

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-zinc-100 rounded-lg shadow-md mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-zinc-900">
            Test Results: {test.testName}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Total Score</p>
              <p className="text-3xl font-bold text-blue-600">
                {results.score}
              </p>
              <p className="text-sm text-gray-600">out of {totalMarks}</p>
            </div>

            <div className="bg-green-200 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Percentage</p>
              <p className="text-3xl font-bold text-green-600">{percentage}%</p>
              <p className="text-sm text-gray-600">
                {percentage >= passingScore ? "Passed" : "Failed"}
              </p>
            </div>

            <div className="bg-purple-200 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">Correct Answers</p>
              <p className="text-3xl font-bold text-purple-600">
                {correctAnswers}
              </p>
              <p className="text-sm text-gray-600">out of {totalQuestions}</p>
            </div>
          </div>

          <div className="space-y-6 text-black">
            <h2 className="text-xl font-semibold mb-4">Question Review</h2>

            {test.questions.map((question, index) => {
              const userAnswer = results.answers[index]?.selectedAnswer
              const isCorrect = userAnswer === question.CorrectAnswer

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    isCorrect
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-lg flex-1">
                      <span className="font-medium">{index + 1}.</span>{" "}
                      {question.QuestionText}
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        isCorrect
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {["A", "B", "C", "D"].map((option) => (
                      <div
                        key={option}
                        className={`p-2 rounded ${
                          option === userAnswer
                            ? isCorrect
                              ? "bg-green-200"
                              : "bg-red-200"
                            : option === question.CorrectAnswer
                            ? "bg-green-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <span className="font-medium mr-2">{option}:</span>
                        {question[`Option${option}`]}
                      </div>
                    ))}
                  </div>

                  {!isCorrect && (
                    <div className="mt-4 text-sm text-gray-600">
                      <span className="font-medium">Correct Answer:</span>{" "}
                      {question[`Option${question.CorrectAnswer}`]}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Print Results
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestResults
