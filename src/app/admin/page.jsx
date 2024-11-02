"use client"
import { useRouter } from "next/navigation"
import { UserButton, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import {
  Bell,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react"
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
  const [activeTab, setActiveTab] = useState("users")
  const { user } = useUser()
  const router = useRouter()

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
          console.log("Fetched tests:", response.data.tests)
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
          console.log("Fetched users:", response.data.results)
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
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 shadow-md transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-lg font-semibold text-purple-400">
            {`${user?.firstName}`} Dashboard
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-5 w-5 text-white" />
          </Button>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <Button
            onClick={() => setActiveTab("users")}
            className="mx-2 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-md"
          >
            Users
          </Button>
          <Button
            onClick={() => setActiveTab("tests")}
            className="mx-2 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-md"
          >
            Tests
          </Button>
          <Button
            onClick={() => {
              router.push("/")
            }}
            className="mx-2 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-md"
          >
            Home
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 shadow-md border-b border-gray-700">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="mr-2 lg:hidden"
              >
                <Menu className="h-5 w-5 text-white" />
              </Button>
              <h2 className="text-lg font-semibold text-purple-400">
                Dashboard
              </h2>
            </div>
            <div className="flex gap-x-6 ">
              <Button
                onClick={() => {
                  router.push("/")
                }}
                className="mx-2 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-md"
              >
                Home
              </Button>
              <UserButton />
            </div>
          </div>
        </header>
        {/* Main content with tabs */}
        <main className="flex-1 p-6 bg-gray-900 text-white">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-2 bg-gray-800 border border-gray-700">
              <TabsTrigger value="users" className="text-purple-400">
                Users
              </TabsTrigger>
              <TabsTrigger value="tests" className="text-purple-400">
                Tests
              </TabsTrigger>
            </TabsList>

            {/* Users tab content */}
            <TabsContent value="users" className="space-y-4">
              <Card className="border border-gray-700 shadow-md rounded-lg bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-purple-400">
                    Manage Users
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    View and manage user accounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-4">
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="md:max-w-sm border border-gray-600 bg-gray-700 text-white rounded-md"
                    />
                  </div>
                  <div className="overflow-x-auto">
                    <Table className="min-w-full border border-gray-700 bg-gray-800">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-purple-400">
                            Test Name
                          </TableHead>
                          <TableHead className="text-purple-400">
                            Students
                          </TableHead>
                          <TableHead className="text-purple-400 hidden md:table-cell">
                            Score
                          </TableHead>
                          <TableHead className="text-purple-400 hidden md:table-cell">
                            Attempted At
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow
                            key={user.resultId}
                            className="hover:bg-gray-700"
                          >
                            <TableCell className="text-white">
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

            {/* Tests tab content */}
            <TabsContent value="tests" className="space-y-4">
              <Card className="border border-gray-700 shadow-md rounded-lg bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-purple-400">
                    Manage Tests
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    View and manage created tests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-4">
                    <Input
                      placeholder="Search tests..."
                      value={searchTests}
                      onChange={(e) => setSearchTests(e.target.value)}
                      className="md:max-w-sm border border-gray-600 bg-gray-700 text-white rounded-md"
                    />
                    <Link href={"/upload-handler-3"}>
                      <Button className="bg-purple-600 text-white hover:bg-purple-700 rounded-md">
                        <Plus className="mr-2 h-4 w-4" /> Create New Test
                      </Button>
                    </Link>
                  </div>
                  <div className="overflow-x-auto">
                    <Table className="min-w-full border border-gray-700 bg-gray-800">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-purple-400">
                            Test Name
                          </TableHead>
                          <TableHead className="text-purple-400">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTests.map((test) => (
                          <TableRow
                            key={test._id}
                            className="hover:bg-gray-700"
                          >
                            <TableCell className="text-white">
                              {test.testName}
                            </TableCell>
                            <TableCell>
                              <Link href={`/attempt-test/${test._id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-purple-400 hover:text-purple-300"
                                >
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
