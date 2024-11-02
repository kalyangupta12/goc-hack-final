"use client"
import { useUser } from "@clerk/nextjs"
import React, { useState } from "react"
import * as XLSX from "xlsx"
import toast, {Toaster} from 'react-hot-toast'
import { TestShareCard } from "@/sections/TestShareCard"
import "react-toastify/dist/ReactToastify.css"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { useForm, useFieldArray } from "react-hook-form"
import axios from "axios"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlignLeftIcon } from "@radix-ui/react-icons"
import { IconArrowLeftToArc } from "@tabler/icons-react"
import { ToastNotification } from "@/components/toastnotifivation"
const CreateTestPage = () => {
  const [testLink, setTestLink] = useState("")
  const [testCode, setTestCode] = useState("")
  const { user } = useUser()

  const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      testName: "",
      numberOfAttempts: 1,
      questionRandomization: false,
      testAccessPeriod: "",
      questions: [
        {
          QuestionText: "",
          OptionA: "",
          OptionB: "",
          OptionC: "",
          OptionD: "",
          CorrectAnswer: "",
          Marks: "",
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  })

  const onFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result)
        const workbook = XLSX.read(data, { type: "array" })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: [
            "QuestionText",
            "OptionA",
            "OptionB",
            "OptionC",
            "OptionD",
            "CorrectAnswer",
            "Marks",
          ],
        })
        setValue("questions", jsonData.slice(1))
        toast.success("Questions loaded successfully!")
      }
      reader.readAsArrayBuffer(file)
    } else {
      toast.error("Please upload a valid Excel file")
    }
  }

  const onSubmit = async (data) => {
    if (!data.testName || data.questions.length === 0) {
      toast.error("Please provide a test name and upload questions.")
      return
    }
    const testData = {
      ...data,
      testAdmin: user?.primaryEmailAddress?.emailAddress || "",
    }

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/api/tests",
        testData
      )
      if (response.status === 201) {
        toast.custom(<ToastNotification />)
        setTestCode(response.data.code)
        setTestLink(response.data.link)
      } else {
        toast.error("Error creating test. Please try again.")
      }
    } catch (error) {
      console.error(error)
      toast.error("Error connecting to server.")
    }
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return
    const reorderedQuestions = Array.from(watch("questions"))
    const [removed] = reorderedQuestions.splice(result.source.index, 1)
    reorderedQuestions.splice(result.destination.index, 0, removed)
    setValue("questions", reorderedQuestions)
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-950 via-gray-900 to-black p-10 font-poppins">
      <div className="flex items-center justify-between mb-8">
      <Toaster
      position="top-center"
      reverseOrder={false}
    />
        <Link href="/admin">
          <Button
            variant="ghost"
            className="text-purple-300 hover:text-purple-200 hover:bg-purple-900/20"
          >
            <IconArrowLeftToArc className="w-6 h-6" />
            Admin Dashboard
          </Button>
        </Link>
      </div>
      {testLink && testCode && (
        <TestShareCard testLink={testLink} testCode={testCode} />
      )}

      <div className="max-w-3xl mx-auto backdrop-blur-xl bg-gray-900/40 p-8 rounded-2xl shadow-2xl border border-purple-500/10 mb-6">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text text-transparent text-center mb-6">
          Create a New Test
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div>
              <label className="block text-purple-200 text-lg font-semibold mb-2">
                Test Name
              </label>
              <input
                type="text"
                {...register("testName", { required: true })}
                placeholder="Enter Test Name"
                className="w-full p-3 bg-gray-800/50 border border-purple-700/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-purple-200 text-lg font-semibold mb-2">
                  Number of Attempts
                </label>
                <input
                  type="number"
                  {...register("numberOfAttempts", { required: true, min: 1 })}
                  className="w-full p-3 bg-gray-800/50 border border-purple-700/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100"
                />
              </div>

              <div>
                <label className="block text-purple-200 text-lg font-semibold mb-2">
                  Question Randomization
                </label>
                <select
                  {...register("questionRandomization")}
                  className="w-full p-3 bg-gray-800/50 border border-purple-700/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100"
                >
                  <option value="false">Disabled</option>
                  <option value="true">Enabled</option>
                </select>
              </div>

              <div>
                <label className="block text-purple-200 text-lg font-semibold mb-2">
                  Test Duration (min)
                </label>
                <input
                  type="number"
                  {...register("testAccessPeriod", { required: true })}
                  placeholder="Enter (in minutes)"
                  className="w-full p-3 bg-gray-800/50 border border-purple-700/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-purple-900/50 transition-all duration-200 transform hover:scale-105"
              >
                Create Test
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="max-w-3xl mx-auto backdrop-blur-xl bg-gray-900/40 p-8 rounded-2xl shadow-2xl border border-purple-500/10 mb-6">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text text-transparent text-center mb-6">
          Upload Questions
        </h2>

        <div className="relative group mb-8">
          <input
            type="file"
            onChange={onFileChange}
            accept=".xlsx"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="p-4 border-2 border-dashed border-purple-500/30 rounded-lg text-center group-hover:border-purple-500/50 transition-colors">
            <p className="text-purple-200">
              Drop your Excel file here or click to browse
            </p>
            <p className="text-sm text-purple-400/60">Supports .xlsx format</p>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {fields.map((field, index) => (
                  <Draggable
                    key={field.id}
                    draggableId={String(index)}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="bg-gray-800/40 p-6 rounded-xl shadow-lg mb-4 border border-purple-700/20 hover:border-purple-500/30 transition-colors"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-medium text-purple-200">
                            Question {index + 1}
                          </span>
                          <div className="flex gap-x-4">
                            <button
                              className="text-red-400/60 bg-red-900/10 hover:text-red-400 hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </button>
                            <button
                              className="text-emerald-400/60 bg-emerald-900/10 hover:text-emerald-400 hover:bg-emerald-900/20 px-6 rounded-lg transition-colors"
                              onClick={() => append(index)}
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <input
                            type="text"
                            {...register(`questions.${index}.QuestionText`, {
                              required: true,
                            })}
                            placeholder="Enter Question"
                            className="w-full p-3 bg-gray-800/50 border border-purple-700/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100"
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {["A", "B", "C", "D"].map((option) => (
                              <input
                                key={option}
                                type="text"
                                {...register(
                                  `questions.${index}.Option${option}`,
                                  { required: true }
                                )}
                                placeholder={`Option ${option}`}
                                className="w-full p-3 bg-gray-800/50 border border-purple-700/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100"
                              />
                            ))}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              {...register(`questions.${index}.CorrectAnswer`, {
                                required: true,
                              })}
                              placeholder="Correct Answer"
                              className="w-full p-3 bg-gray-800/50 border border-purple-700/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100"
                            />
                            <input
                              type="number"
                              {...register(`questions.${index}.Marks`, {
                                required: true,
                                min: 1,
                              })}
                              placeholder="Marks"
                              className="w-full p-3 bg-gray-800/50 border border-purple-700/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-100"
                            />
                          </div>
                        </div>
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
  )
}

export default CreateTestPage
