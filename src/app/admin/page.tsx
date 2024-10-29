"use client"

import { UserButton, useUser } from "@clerk/nextjs"
import { useState } from "react"
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
import { Separator } from "@/components/ui/separator"

// Mock data for the dashboard
const summaryStats = {
  totalUsers: 1234,
  totalTests: 567,
  activeTests: 89,
}

const recentActivity = [
  {
    action: "New user registered",
    user: "john@example.com",
    timestamp: "2 minutes ago",
  },
  {
    action: "Test created",
    user: "sarah@example.com",
    timestamp: "15 minutes ago",
  },
  {
    action: "User deleted",
    user: "admin@example.com",
    timestamp: "1 hour ago",
  },
]

const users = [
  {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    role: "user",
    registrationDate: "2023-01-15",
  },
  {
    id: 2,
    username: "jane_smith",
    email: "jane@example.com",
    role: "admin",
    registrationDate: "2023-02-20",
  },
  {
    id: 3,
    username: "bob_johnson",
    email: "bob@example.com",
    role: "user",
    registrationDate: "2023-03-10",
  },
]

const tests = [
  {
    id: 1,
    name: "Math Quiz",
    createdBy: "john_doe",
    creationDate: "2023-04-01",
  },
  {
    id: 2,
    name: "Science Test",
    createdBy: "jane_smith",
    creationDate: "2023-04-15",
  },
  {
    id: 3,
    name: "History Exam",
    createdBy: "bob_johnson",
    creationDate: "2023-05-01",
  },
]

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-zinc-900 text-gray-100">
      {/* Sidebar - hidden on mobile, shown on larger screens */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 shadow-md transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
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
                <Users className="mr-2 h-4 w-4" />
                Students
              </Button>
            </li>
           
          </ul>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 shadow-sm">
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
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
          <div className="container mx-auto px-4 py-6">
            <Tabs defaultValue="summary" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="tests">Tests</TabsTrigger>
              </TabsList>

              {/* Summary tab content */}
              <TabsContent value="summary" className="space-y-4">
                {/* Summary statistics cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Users
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {summaryStats.totalUsers}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Tests
                      </CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {summaryStats.totalTests}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Active Tests
                      </CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <path d="M2 10h20" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {summaryStats.activeTests}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent activity table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest actions performed in the system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Action</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead className="text-right">
                            Timestamp
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentActivity.map((activity, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {activity.action}
                            </TableCell>
                            <TableCell>{activity.user}</TableCell>
                            <TableCell className="text-right">
                              {activity.timestamp}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Users tab content */}
              <TabsContent value="users" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Users</CardTitle>
                    <CardDescription>
                      View and manage user accounts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* User search and add user button */}
                    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-4">
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="md:max-w-sm"
                      />
                      <Button className="md:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> Add User
                      </Button>
                    </div>
                    {/* Users table */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Role
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Registration Date
                            </TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">
                                {user.username}
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                {user.role}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {user.registrationDate}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Delete
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

              {/* Tests tab content */}
              <TabsContent value="tests" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Tests</CardTitle>
                    <CardDescription>
                      View and manage created tests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Test search and create new test button */}
                    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-4">
                      <Input
                        placeholder="Search tests..."
                        className="md:max-w-sm"
                      />
                      <Button className="md:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> Create New Test
                      </Button>
                    </div>
                    {/* Tests table */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Test Name</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Created By
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Creation Date
                            </TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tests.map((test) => (
                            <TableRow key={test.id}>
                              <TableCell className="font-medium">
                                {test.name}
                              </TableCell>
                              <TableCell className="hidden  md:table-cell">
                                {test.createdBy}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {test.creationDate}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Delete
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="hidden md:inline-flex"
                                >
                                  Preview
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

           
            
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
