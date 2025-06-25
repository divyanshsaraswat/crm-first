"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CalendarDays, TrendingUp, AlertTriangle, NotebookIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Globe, Lock, Mail, Shield, User, Users, Workflow,CheckCircle } from "lucide-react"
import { Header } from "@/components/sidebar"

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [browserNotifications, setBrowserNotifications] = useState(true)
  const [activeTab, setActiveTab] = useState("task-summary")
  const [weeklyReports, setWeeklyReports] = useState(true)
  const [leadAlerts, setLeadAlerts] = useState(true)
  const [taskReminders, setTaskReminders] = useState(true)
const taskSummaryData = {
  totalTasks: 520,
  completed: 410,
  completionRate: 78.8,
  pending: 82,
  overdue: 28,
  avgCompletionTime: 2.6,
}

const tasksByContactData = [
  { name: "John Doe", total: 12, completed: 10, pending: 2, lastTask: "2025-06-23", completionRate: 83.3 },
  { name: "Acme Corp", total: 8, completed: 8, pending: 0, lastTask: "2025-06-20", completionRate: 100 },
  { name: "Jane Smith", total: 14, completed: 11, pending: 3, lastTask: "2025-06-24", completionRate: 78.6 },
  { name: "Tech Solutions", total: 9, completed: 7, pending: 2, lastTask: "2025-06-22", completionRate: 77.8 },
  { name: "Global Inc", total: 15, completed: 12, pending: 3, lastTask: "2025-06-21", completionRate: 80.0 },
]

const teamPerformanceData = [
  { name: "Alice", total: 45, completed: 38, overdue: 3 },
  { name: "Bob", total: 52, completed: 41, overdue: 5 },
  { name: "Carol", total: 38, completed: 35, overdue: 2 },
  { name: "David", total: 41, completed: 33, overdue: 4 },
]

const overdueTasksData = [
  { title: "Call Follow-up", assignedTo: "Alice", contact: "Jane Smith", dueDate: "2025-06-20", daysOverdue: 5 },
  { title: "Send Proposal", assignedTo: "Bob", contact: "Acme Corp", dueDate: "2025-06-22", daysOverdue: 3 },
  { title: "Contract Review", assignedTo: "Carol", contact: "Tech Solutions", dueDate: "2025-06-19", daysOverdue: 6 },
  { title: "Demo Preparation", assignedTo: "David", contact: "Global Inc", dueDate: "2025-06-21", daysOverdue: 4 },
]

const contactEngagementData = [
  { name: "John Doe", lastTask: "2025-06-24", tasksThisMonth: 4, frequency: "1/week" },
  { name: "Jane Smith", lastTask: "2025-06-10", tasksThisMonth: 1, frequency: "Low" },
  { name: "Acme Corp", lastTask: "2025-06-23", tasksThisMonth: 6, frequency: "2/week" },
  { name: "Tech Solutions", lastTask: "2025-06-22", tasksThisMonth: 3, frequency: "1/week" },
  { name: "Global Inc", lastTask: "2025-06-21", tasksThisMonth: 5, frequency: "1.5/week" },
]


  const chartConfig = {
    total: {
      label: "Total Tasks",
      color: "green",
    },
    completed: {
      label: "Completed",
      color: "red",
    },
    overdue: {
      label: "Overdue",
      color: "purple",
    },
  }
  return (
        <div className="flex-1 flex flex-col px-8 pb-12  overflow-scroll bg-transparent" style={{scrollbarWidth:"none"}}>
        <Header/>
        <main className="flex flex-col overflow-y-auto p-6 gap-5">
          <div className="text-2xl flex flex-row items-center gap-3 font-bold" style={{fontFamily:"var(--font-noto-sans)"}}>
                    <NotebookIcon color="green"/>Reports*
                     <div className="text-[10px]">(Using a fake example data.)</div>
                    </div>
        </main>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-fit grid-cols-4 grid-wrap justify-center md:grid-cols-5 mb-12">
            <TabsTrigger value="task-summary">Task Summary</TabsTrigger>
            <TabsTrigger value="tasks-by-contact">Tasks by Contact</TabsTrigger>
            <TabsTrigger value="team-performance">Team Performance</TabsTrigger>
            <TabsTrigger value="overdue-tasks">Overdue Tasks</TabsTrigger>
            <TabsTrigger value="contact-engagement">Contact Engagement</TabsTrigger>
          </TabsList>

          {/* Task Summary Tab */}
          <TabsContent value="task-summary">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task Summary Card */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    Task Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{taskSummaryData.totalTasks}</div>
                      <div className="text-sm text-gray-600 mt-1">Total Tasks Created</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{taskSummaryData.completed}</div>
                      <div className="text-sm text-gray-600 mt-1">Tasks Completed</div>
                      <div className="text-xs text-green-600 font-medium">({taskSummaryData.completionRate}%)</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{taskSummaryData.pending}</div>
                      <div className="text-xs text-gray-600 mt-1">Tasks Pending</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{taskSummaryData.overdue}</div>
                      <div className="text-xs text-gray-600 mt-1">Overdue Tasks</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{taskSummaryData.avgCompletionTime}</div>
                      <div className="text-xs text-gray-600 mt-1">Avg Days</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tasks by Contact Table */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <Users className="h-5 w-5 text-blue-600" />
                    Tasks by Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Contact Name</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Completed</TableHead>
                        <TableHead className="text-right">Pending</TableHead>
                        <TableHead>Last Task</TableHead>
                        <TableHead className="text-right">Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasksByContactData.map((contact, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{contact.name}</TableCell>
                          <TableCell className="text-right">{contact.total}</TableCell>
                          <TableCell className="text-right text-green-600">{contact.completed}</TableCell>
                          <TableCell className="text-right text-yellow-600">{contact.pending}</TableCell>
                          <TableCell className="text-sm text-gray-600">{contact.lastTask}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={contact.completionRate === 100 ? "default" : "secondary"}>
                              {contact.completionRate}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tasks by Contact Tab */}
          <TabsContent value="tasks-by-contact">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Users className="h-5 w-5 text-blue-600" />
                  Tasks by Contact - Detailed View
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact Name</TableHead>
                      <TableHead className="text-right">Total Tasks</TableHead>
                      <TableHead className="text-right">Completed</TableHead>
                      <TableHead className="text-right">Pending</TableHead>
                      <TableHead>Last Task Date</TableHead>
                      <TableHead className="text-right">Completion Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasksByContactData.map((contact, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell className="text-right font-semibold">{contact.total}</TableCell>
                        <TableCell className="text-right text-green-600 font-medium">{contact.completed}</TableCell>
                        <TableCell className="text-right text-yellow-600 font-medium">{contact.pending}</TableCell>
                        <TableCell className="text-sm text-gray-600">{contact.lastTask}</TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={
                              contact.completionRate === 100
                                ? "default"
                                : contact.completionRate >= 80
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {contact.completionRate}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Performance Tab */}
          <TabsContent value="team-performance">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Team Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={teamPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="total" fill="var(--color-total)" name="Total Tasks" />
                      <Bar dataKey="completed" fill="var(--color-completed)" name="Completed" />
                      <Bar dataKey="overdue" fill="var(--color-overdue)" name="Overdue" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {teamPerformanceData.map((member, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-600 mt-2 space-y-1">
                        <div>Total: {member.total}</div>
                        <div className="text-green-600">Completed: {member.completed}</div>
                        <div className="text-red-600">Overdue: {member.overdue}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overdue Tasks Tab */}
          <TabsContent value="overdue-tasks">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Overdue Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task Title</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Days Overdue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overdueTasksData.map((task, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>{task.assignedTo}</TableCell>
                        <TableCell>{task.contact}</TableCell>
                        <TableCell className="text-sm text-gray-600">{task.dueDate}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="destructive">{task.daysOverdue} days</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Engagement Tab */}
          <TabsContent value="contact-engagement">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                  Contact Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact Name</TableHead>
                      <TableHead>Last Task Date</TableHead>
                      <TableHead className="text-right">Tasks This Month</TableHead>
                      <TableHead className="text-right">Average Task Frequency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contactEngagementData.map((contact, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell className="text-sm text-gray-600">{contact.lastTask}</TableCell>
                        <TableCell className="text-right font-semibold">{contact.tasksThisMonth}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={contact.frequency === "Low" ? "outline" : "secondary"}>
                            {contact.frequency}
                          </Badge>
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
  )
}
