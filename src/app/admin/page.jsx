"use client"
import { UserButton, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Menu, Plus, X } from "lucide-react"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import axios from "axios"
import Link from "next/link"

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchTests, setSearchTests] = useState("")
  const [users, setUsers] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tests, setTests] = useState([])
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      const fetchTests = async () => {
        try {
          const response = await axios.get(
            process.env.NEXT_PUBLIC_API_URL + "/api/tests",
            {
              params: {
                testAdminEmail: user?.primaryEmailAddress?.emailAddress,
              },
            }
          )
          setTests(response.data.tests)
        } catch (error) {
          console.error("Error fetching tests:", error)
        }
      }

      const fetchUsers = async () => {
        try {
          const response = await axios.get(
            process.env.NEXT_PUBLIC_API_URL + "/api/admin/test-results",
            {
              params: {
                testAdminEmail: user?.primaryEmailAddress?.emailAddress,
              },
            }
          )
          setUsers(response.data.results)
        } catch (error) {
          console.error("Error fetching data", error)
        }
      }

      fetchTests()
      fetchUsers()
    }
  }, [user])

  const filteredUsers = users.filter(
    (e) =>
      e.testName?.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
      e.StudentEmail?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  )

  const filteredTests = tests.filter((e) =>
    e.testName.toLowerCase().includes(searchTests.toLowerCase())
  )
  return (
    <div className="flex h-screen bg-gradient-to-br from-[#1f133c] to-[#2a1f4d]">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#2a1f4d] shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-6 w-6 text-white" />
          </Button>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <Button
            value="users"
            onClick={() => document.getElementById("usersTab").click()}
            className="mx-2 py-2 h-12 bg-purple-600 hover:bg-purple-800 text-white font-semibold rounded-lg shadow-md"
          >
            Users
          </Button>
          <Button
            value="tests"
            onClick={() => document.getElementById("testsTab").click()}
            className="mx-2 py-2 h-12 bg-purple-600 hover:bg-purple-800 text-white font-semibold rounded-lg shadow-md"
          >
            Tests
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-[#2a1f4d] shadow-md">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="mr-2 lg:hidden"
              >
                <Menu className="h-6 w-6 text-white" />
              </Button>
              <h2 className="text-xl font-bold text-white">Dashboard</h2>
            </div>
            <UserButton />
          </div>
        </header>

        {/* Main content with tabs */}
        <main className="flex-1 p-8 ounded-2xl shadow-2xl">
          <Tabs defaultValue="tests" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-white bg-opacity-20 rounded-lg">
              <TabsTrigger id="usersTab" value="users" className="text-white">
                Users
              </TabsTrigger>
              <TabsTrigger id="testsTab" value="tests" className="text-white">
                Tests
              </TabsTrigger>
            </TabsList>

            {/* Users tab */}
            <TabsContent value="users" className="space-y-4">
              <Card className="bg-[#312354] bg-opacity-80 rounded-lg shadow-lg">
                <CardHeader>
                  <CardTitle className="text-white">Manage Users</CardTitle>
                  <CardDescription className="text-gray-300">
                    View and manage user accounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-4">
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="md:max-w-sm"
                    />
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-white">
                            Test Name
                          </TableHead>
                          <TableHead className="text-white">Students</TableHead>
                          <TableHead className="hidden md:table-cell text-white">
                            Score
                          </TableHead>
                          <TableHead className="hidden md:table-cell text-white">
                            Attempted At
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.resultId}>
                            <TableCell className="text-gray-300">
                              {user.testName}
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {user.studentEmail}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-gray-300">
                              {user.score}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-gray-300">
                              {user.submittedAt}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tests tab */}
            <TabsContent value="tests" className="space-y-4">
              <Card className="bg-[#312354] bg-opacity-80 rounded-lg shadow-lg">
                <CardHeader>
                  <CardTitle className="text-white">Manage Tests</CardTitle>
                  <CardDescription className="text-gray-300">
                    View and manage created tests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-4">
                    <Input
                      placeholder="Search tests..."
                      value={searchTests}
                      onChange={(e) => setSearchTests(e.target.value)}
                      className="md:max-w-sm"
                    />
                    <Link href={"/upload-handler-3"}>
                      <Button className="bg-purple-600 hover:bg-purple-800 text-white rounded-lg shadow-md">
                        <Plus className="mr-2 h-4 w-4" /> Create New Test
                      </Button>
                    </Link>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-white">
                            Test Name
                          </TableHead>
                          <TableHead className="text-white">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTests.map((test) => (
                          <TableRow key={test.testId}>
                            <TableCell className="text-gray-300">
                              {test.testName}
                            </TableCell>
                            <TableCell className="text-gray-300">
                              <Link href={`/attempt-test/${test._id}`}>
                                <Button className="bg-blue-600 hover:bg-blue-800 text-white">
                                  View
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
