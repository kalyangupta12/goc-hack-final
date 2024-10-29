"use client"
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
import { Separator } from "@/components/ui/separator";
import axios from 'axios';
import Link from "next/link"

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTests, setSearchTests] = useState("");
  const [users, setUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tests, setTests] = useState([]);
  const { user } = useUser();

  
  useEffect(() => {
    if (user) { 
      const fetchTests = async () => {
        try {
          const response = await axios.get('https://excelitest-api.vercel.app/api/tests', {
            params: { testAdminEmail: user?.primaryEmailAddress?.emailAddress }
          });
  
          setTests(response.data.tests);
          console.log('Fetched tests:', response.data.tests); // Log the fetched tests directly
        } catch (error) {
          console.error('Error fetching tests:', error);
        }
      };
  
      const fetchUsers = async () => {
        try {
          const response = await axios.get('https://excelitest-api.vercel.app/api/admin/test-results', {
            params: { testAdminEmail: user?.primaryEmailAddress?.emailAddress }
          });
          setUsers(response.data.results);
          console.log('Fetched users:', response.data.results); // Log the fetched users
        } catch (error) {
          console.error('Error fetching data', error);
        }
      };
  
      fetchTests(); // Call fetchTests
      fetchUsers(); // Call fetchUsers
    }
  }, [user]);

  const filteredUsers = users.filter((e) =>
    (e.testName?.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
     e.StudentEmail?.toLowerCase().includes(searchTerm?.toLowerCase() || ""))
  );
  

  const filteredTests = tests.filter((e) =>
    e.testName.toLowerCase().includes(searchTests.toLowerCase())
  );


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
            <Tabs defaultValue="Users" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="tests">Tests</TabsTrigger>
              </TabsList>

             

              {/* Users tab content */}
              <TabsContent value="users" className="space-y-4 ">
                <Card className="bg-gray-100">
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
                     
                    </div>
                    {/* Users table */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Test Name</TableHead>
                            <TableHead>Students</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Score
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Attempted At
                            </TableHead>
                            {/* <TableHead>Actions</TableHead> */}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((user) => (
                            <TableRow key={user.resultId}>
                              <TableCell className="font-medium">
                                {user.testName}
                              </TableCell>
                              <TableCell>{user.studentEmail}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                {user.score}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {user.submittedAt}
                              </TableCell>
                              {/* <TableCell>
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Delete
                                </Button>
                              </TableCell> */}
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
                        value={searchTests}
                        onChange={(e) => setSearchTests(e.target.value)}
                      />
                      <Link href={"/upload-handler-3"}>
                      <Button className="md:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> Create New Test
                      </Button>
                      </Link>
                    </div>
                    {/* Tests table */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Test Name</TableHead>
                            {/* <TableHead className="hidden md:table-cell">
                              Created By
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                              Creation Date
                            </TableHead> */}
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTests.map((test) => (
                            <TableRow key={test._id}>
                              <TableCell className="font-medium">
                                {test.testName}
                              </TableCell>
                              {/* <TableCell className="hidden  md:table-cell">
                                {test.createdBy}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {test.creationDate}
                              </TableCell> */}
                              <TableCell>
                                {/* <Button variant="ghost" size="sm">
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Delete
                                </Button> */}
                                
                                <Link href={`/attempt-test/${test._id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
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
          </div>
        </main>
      </div>
    </div>
  )
}
