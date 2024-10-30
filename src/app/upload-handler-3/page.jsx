// page.js
'use client';
import { useUser } from '@clerk/nextjs';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { ToastContainer, toast } from 'react-toastify';
import { TestShareCard } from '@/sections/TestShareCard';
import 'react-toastify/dist/ReactToastify.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
const CreateTestPage = () => {
  const [testLink, setTestLink] = useState("");
  const [testCode, setTestCode] = useState("");
  const { user } = useUser();

  const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      testName: '',
      numberOfAttempts: 1,
      questionRandomization: false,
      testAccessPeriod: '',
      questions: [{ QuestionText: '', OptionA: '', OptionB: '', OptionC: '', OptionD: '', CorrectAnswer: '', Marks: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions'
  });

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: ['QuestionText', 'OptionA', 'OptionB', 'OptionC', 'OptionD', 'CorrectAnswer', 'Marks'] });
        setValue('questions', jsonData.slice(1)); // skip header row
        console.log(jsonData.slice(1)); // Log the loaded data
        toast.success('Questions loaded successfully!');
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.error('Please upload a valid Excel file');
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    if (!data.testName || data.questions.length === 0) {
      toast.error('Please provide a test name and upload questions.');
      return;
    }
    const testData = {
      ...data,
      testAdmin: user?.primaryEmailAddress?.emailAddress || '' // Get Clerk user email
    };
  
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL+'/api/tests', testData);
      if (response.status === 201) {
        toast.success('Test created successfully!');
        console.log('Test created successfully:', response.data);
  
        // Display or navigate to the test link
        const testLink = response.data.link;
        setTestCode(response.data.code); // Assuming your API returns a code
        setTestLink(testLink); // Set link in state for UI display
      } else {
        toast.error('Error creating test. Please try again.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error connecting to server.');
    }
  };
  
  

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedQuestions = Array.from(watch('questions'));
    const [removed] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, removed);
    setValue('questions', reorderedQuestions);
  };

  const handleAddRow = (index) => {
    const newQuestion = { QuestionText: '', OptionA: '', OptionB: '', OptionC: '', OptionD: '', CorrectAnswer: '', Marks: '' };
    const updatedQuestions = [...watch('questions').slice(0, index + 1), newQuestion, ...watch('questions').slice(index + 1)];
    setValue('questions', updatedQuestions);
  };

  return (
    <div className="min-h-screen w-full bg-zinc-900 p-10 font-poppins">
      <div className='flex items-center justify-center mb-4'><Link href={"/admin"}>
      
      <Button variant="secondary" size="lg" > Admin Dashboard</Button>
      </Link>
      </div>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md mb-6">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">Create a New Test</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block text-gray-700 text-lg font-semibold mb-2">Test Name</label>
          <input
            type="text"
            {...register('testName', { required: true })}
            placeholder="Enter Test Name"
            className="w-full p-3 text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex items-center justify-between mt-4 mb-4">
            <label className="block text-gray-700 text-lg font-semibold">Number of Attempts</label>
 <input
              type="number"
              {...register('numberOfAttempts', { required: true, min: 1 })}
              className="w-1/4 p-3 text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between mt-4 mb-4">
            <label className="block text-gray-700 text-lg font-semibold">Question Randomization</label>
            <input
              type="checkbox"
              {...register('questionRandomization')}
              className="w-1/4 p-3 text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between mt-4 mb-4">
            <label className="block text-gray-700 text-lg font-semibold">Test Access Period</label>
            <input
              type="text"
              {...register('testAccessPeriod', { required: true })}
              placeholder="Enter (in minutes)"
              className="w-1/4 p-3 text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className='flex justify-center'>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            >
              Create Test
            </button>
          </div>

          <ToastContainer />
        </form>
      </div>
      {(testLink && testCode) && (
        <TestShareCard 
          testLink={testLink}
          testCode={testCode}
      />)}

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md mb-6">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">Upload Questions</h2>
        <input
          type="file"
          onChange={onFileChange}
          accept=".xlsx"
          className="w-full p-3 text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {fields.map((field, index) => (
                  <Draggable key={field.id} draggableId={String(index)} index={index}>
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="bg-white p-4 rounded-lg shadow-md mb-4"
                      >
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700 text-lg font-semibold">Question {index + 1}</span>
                          <button
                            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => handleAddRow(index)}
                          >
                            +
                          </button>
                        </div>
                        <input
                          type="text"
                          {...register(`questions.${index}.QuestionText`, { required: true })}
                          placeholder="Enter Question"
                          className="w-full p-3 text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="flex flex-wrap mb-4">
                          <div className="w-1/2 pr-2">
                            <label className="block text-gray-700 text-lg font-semibold">Option A</label>
                            <input
                              type="text"
                              {...register(`questions.${index}.OptionA`, { required: true })}
                              placeholder="Enter Option A"
                              className="w-full p-3 text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="w-1/2 pl-2">
                            <label className="block text-gray-700 text-lg font-semibold">Option B</label>
                            <input
                              type="text"
                              {...register(`questions.${index}.OptionB`, { required: true })}
                              placeholder="Enter Option B"
                              className="w-full p-3 text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                        <div className="flex flex-wrap mb-4">
                          <div className="w-1/2 pr-2">
                            <label className="block text-gray-700 text-lg font-semibold">Option C</label>
                            <input
                              type="text"
                              {...register(`questions.${index}.OptionC`, { required: true })}
                              placeholder="Enter Option C"
                              className="w-full p-3 text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="w-1/2 pl-2">
                            <label className="block text-gray-700 text-lg font-semibold">Option D</label>
                            <input
                              type="text"
                              {...register(`questions.${index}.OptionD`, { required: true })}
                              placeholder="Enter Option D"
                              className="w-full p-3 text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                        <div className="flex flex-wrap mb-4">
                          <div className="w-1/2 pr-2">
                            <label className="block text-gray-700 text-lg font-semibold">Correct Answer</label>
                            <input
                              type="text"
                              {...register(`questions.${index}.CorrectAnswer`, { required: true })}
                              placeholder="Enter Correct Answer"
                              className="w-full p-3 text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="w-1/2 pl-2">
                            <label className="block text-gray-700 text-lg font-semibold">Marks</label>
                            <input
                              type="number"
                              {...register(`questions.${index}.Marks`, { required: true, min: 1 })}
                              className="w-full p-3 text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default CreateTestPage;
