"use client"

import { UserButton, useUser } from "@clerk/nextjs"
import { useState } from "react"
import { Bell, LogOut, Menu, Play, Search, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

// Mock data for the user dashboard
// const userInfo = {
//   name: "John Doe",
//   email: "john@example.com",
// }

const upcomingTests = [
  { id: 1, name: "Math Quiz", date: "2023-05-15", subject: "Mathematics" },
  { id: 2, name: "History Exam", date: "2023-05-20", subject: "History" },
]

const recentScores = [
  { id: 1, name: "Science Test", score: 85, date: "2023-05-01" },
  { id: 2, name: "English Essay", score: 92, date: "2023-04-28" },
]

const availableTests = [
  { id: 1, name: "Geography Quiz", subject: "Geography", duration: "30 mins" },
  { id: 2, name: "Literature Review", subject: "English", duration: "45 mins" },
]

const ongoingTests = [
  { id: 1, name: "Physics Midterm", subject: "Physics", progress: 60 },
]

const pastTestResults = [
  {
    id: 1,
    name: "Biology Final",
    score: 88,
    date: "2023-04-15",
    subject: "Biology",
  },
  {
    id: 2,
    name: "Chemistry Lab",
    score: 95,
    date: "2023-04-10",
    subject: "Chemistry",
  },
  {
    id: 3,
    name: "Math Midterm",
    score: 78,
    date: "2023-03-25",
    subject: "Mathematics",
  },
]

export default function UserDashboard() {
  const { user } = useUser()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [joinCode, setJoinCode] = useState("")

  const handleJoinTest = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the join code to your backend
    console.log(`Joining test with code: ${joinCode}`)
    // Reset the join code input
    setJoinCode("")
  }

  return (
    <div className="flex h-screen bg-black text-gray-100">
      {/* Sidebar - hidden on mobile, shown on larger screens */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-black shadow-md transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">{user?.firstName}'s Dashboard</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Dashboard
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                My Tests
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                Results
              </Button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-black shadow-sm">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="mr-2 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h2 className="text-xl font-bold">Dashboard</h2>
            </div>
            <UserButton />
          </div>
        </header>

        {/* Main content with tabs */}
        <main className="flex-1 overflow-x-hidden  overflow-y-auto bg-zinc-900">
          <div className="container mx-auto px-4 py-6">
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 bg-black">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="mytests">My Tests</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
              </TabsList>

              {/* Overview tab content */}
              <TabsContent value="overview" className="space-y-4">
                <Card className="bg-black text-white border-none">
                  <CardHeader>
                    <CardTitle>Welcome back, {user?.firstName}!</CardTitle>
                    <CardDescription className="text-gray-400">
                      Here's an overview of your upcoming tests and recent
                      scores.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Join a Test
                      </h3>
                      <form
                        onSubmit={handleJoinTest}
                        className="flex space-x-2"
                      >
                        <Input
                          type="text"
                          placeholder="Enter test code"
                          value={joinCode}
                          onChange={(e) => setJoinCode(e.target.value)}
                          className="bg-gray-800 text-white"
                        />
                        <Button variant="destructive" type="submit">
                          Join Test
                        </Button>
                      </form>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Upcoming Tests
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Test Name</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {upcomingTests.map((test) => (
                            <TableRow key={test.id}>
                              <TableCell className="font-medium">
                                {test.name}
                              </TableCell>
                              <TableCell>{test.subject}</TableCell>
                              <TableCell>{test.date}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="">
                      <h3 className="text-lg font-semibold mb-2">
                        Previous Test
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Test Name</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentScores.map((score) => (
                            <TableRow key={score.id}>
                              <TableCell className="font-medium">
                                {score.name}
                              </TableCell>
                              <TableCell>{score.score}%</TableCell>
                              <TableCell>{score.date}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* My Tests tab content */}
              <TabsContent value="mytests" className="space-y-4">
                <Card className="bg-black text-white">
                  <CardHeader>
                    <CardTitle>My Tests</CardTitle>
                    <CardDescription className="text-gray-400">
                      View and manage your available and ongoing tests.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Available Tests
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Test Name</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {availableTests.map((test) => (
                            <TableRow key={test.id}>
                              <TableCell className="font-medium">
                                {test.name}
                              </TableCell>
                              <TableCell>{test.subject}</TableCell>
                              <TableCell>{test.duration}</TableCell>
                              <TableCell>
                                <Button size="sm">
                                  <Play className="mr-2 h-4 w-4" />
                                  Start
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Ongoing Tests
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Test Name</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ongoingTests.map((test) => (
                            <TableRow key={test.id}>
                              <TableCell className="font-medium">
                                {test.name}
                              </TableCell>
                              <TableCell>{test.subject}</TableCell>
                              <TableCell>
                                <Progress
                                  value={test.progress}
                                  className="w-[60%]"
                                />
                              </TableCell>
                              <TableCell>
                                <Button size="sm">
                                  <Play className="mr-2 h-4 w-4" />
                                  Resume
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Results tab content */}
              <TabsContent value="results" className="space-y-4">
                <Card className="bg-black text-white">
                  <CardHeader>
                    <CardTitle>Test Results</CardTitle>
                    <CardDescription className="text-gray-400">
                      View your past test scores and detailed results.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Test Name</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pastTestResults.map((result) => (
                          <TableRow key={result.id}>
                            <TableCell className="font-medium">
                              {result.name}
                            </TableCell>
                            <TableCell>{result.subject}</TableCell>
                            <TableCell>{result.score}%</TableCell>
                            <TableCell>{result.date}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
