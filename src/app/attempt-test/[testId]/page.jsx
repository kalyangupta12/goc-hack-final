"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AttemptTest = () => {
  const params = useParams();
  const testId = params.testId;
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tests/${testId}`);
        setTest(response.data.test);
        // Set initial time based on test duration (assuming duration is in minutes)
        if (response.data.test.Duration) {
          setTimeLeft(response.data.test.Duration * 60); // Convert minutes to seconds
        }
      } catch (error) {
        console.error('Error fetching test data:', error);
        toast.error('Failed to load test. Please try again.');
      }
    };

    if (testId) {
      fetchTest();
    }
  }, [testId]);

  // Timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(new Event('submit'));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Transform answers to match the format in the database
      const formattedAnswers = {};
      Object.keys(answers).forEach(index => {
        formattedAnswers[index] = answers[index].replace('Option', '');
      });

      const response = await axios.post(`http://localhost:5000/api/tests/${testId}/submit`, { 
        answers: formattedAnswers 
      });
      
      toast.success(`Test submitted successfully! Score: ${response.data.score}`);
      console.log('Submitted answers:', formattedAnswers);
      console.log('Test result:', response.data);
      
      // Navigate to results page
      window.location.href = `/test-results/${testId}`;
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error('Error submitting test. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!test) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading test...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Attempt Test: {test.testName}</h1>
            {timeLeft !== null && (
              <div className="text-lg font-semibold p-2 bg-blue-100 rounded-lg">
                Time Left: {formatTime(timeLeft)}
              </div>
            )}
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h2 className="font-semibold mb-2">Test Instructions:</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Read each question carefully before answering</li>
              <li>Once submitted, answers cannot be changed</li>
              <li>Each question carries {test.questions[0]?.Marks || 1} marks</li>
              <li>Total duration: {test.Duration} minutes</li>
            </ul>
          </div>
          
          <form onSubmit={handleSubmit}>
            {test.questions.map((question, index) => (
              <div key={index} className="mb-8 p-4 border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
                <p className="text-lg mb-4">
                  <span className="font-medium">{index + 1}.</span> {question.QuestionText}
                </p>
                
                <div className="space-y-2">
                  {['OptionA', 'OptionB', 'OptionC', 'OptionD'].map((option) => (
                    <label 
                      key={option} 
                      className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={answers[index] === option}
                        onChange={() => 
                          setAnswers((prev) => ({ ...prev, [index]: option }))
                        }
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-gray-700">{question[option]}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="flex justify-between items-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-md text-white font-medium 
                  ${isSubmitting 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Test'}
              </button>
              
              <div className="text-gray-600">
                Total Questions: {test.questions.length}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AttemptTest;