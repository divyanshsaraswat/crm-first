"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Globe, Lock, Mail, Shield, User, Users, Workflow } from "lucide-react"
import { Header } from "@/components/sidebar"

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [browserNotifications, setBrowserNotifications] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(true)
  const [leadAlerts, setLeadAlerts] = useState(true)
  const [taskReminders, setTaskReminders] = useState(true)

  return (
    <div className="container mx-auto  max-w-7xl">
        <Header/>
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 h-auto">
          <TabsTrigger value="profile" className="flex items-center gap-2 py-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 py-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 py-2">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2 py-2">
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Team</span>
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center gap-2 py-2">
            <Workflow className="h-4 w-4" />
            <span className="hidden md:inline">Workflow</span>
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2 py-2">
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">General</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account profile information and email address.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="space-y-4 flex-1">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="Budiono Siregar" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="budiono.sire@gmail.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input id="title" defaultValue="Sales Manager" />
                  </div>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc-7">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-12">UTC-12:00</SelectItem>
                        <SelectItem value="utc-11">UTC-11:00</SelectItem>
                        <SelectItem value="utc-10">UTC-10:00</SelectItem>
                        <SelectItem value="utc-9">UTC-09:00</SelectItem>
                        <SelectItem value="utc-8">UTC-08:00</SelectItem>
                        <SelectItem value="utc-7">UTC-07:00</SelectItem>
                        <SelectItem value="utc-6">UTC-06:00</SelectItem>
                        <SelectItem value="utc-5">UTC-05:00</SelectItem>
                        <SelectItem value="utc-4">UTC-04:00</SelectItem>
                        <SelectItem value="utc-3">UTC-03:00</SelectItem>
                        <SelectItem value="utc-2">UTC-02:00</SelectItem>
                        <SelectItem value="utc-1">UTC-01:00</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="utc+1">UTC+01:00</SelectItem>
                        <SelectItem value="utc+2">UTC+02:00</SelectItem>
                        <SelectItem value="utc+3">UTC+03:00</SelectItem>
                        <SelectItem value="utc+4">UTC+04:00</SelectItem>
                        <SelectItem value="utc+5">UTC+05:00</SelectItem>
                        <SelectItem value="utc+6">UTC+06:00</SelectItem>
                        <SelectItem value="utc+7">UTC+07:00</SelectItem>
                        <SelectItem value="utc+8">UTC+08:00</SelectItem>
                        <SelectItem value="utc+9">UTC+09:00</SelectItem>
                        <SelectItem value="utc+10">UTC+10:00</SelectItem>
                        <SelectItem value="utc+11">UTC+11:00</SelectItem>
                        <SelectItem value="utc+12">UTC+12:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="pt">Portuguese</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how and when you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email notifications for important updates.</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="browser-notifications">Browser Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications in your browser when you're online.
                    </p>
                  </div>
                  <Switch
                    id="browser-notifications"
                    checked={browserNotifications}
                    onCheckedChange={setBrowserNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-reports">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive a weekly summary of your CRM activity.</p>
                  </div>
                  <Switch id="weekly-reports" checked={weeklyReports} onCheckedChange={setWeeklyReports} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="lead-alerts">Lead Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when new leads are assigned to you.</p>
                  </div>
                  <Switch id="lead-alerts" checked={leadAlerts} onCheckedChange={setLeadAlerts} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="task-reminders">Task Reminders</Label>
                    <p className="text-sm text-muted-foreground">Receive reminders for upcoming and overdue tasks.</p>
                  </div>
                  <Switch id="task-reminders" checked={taskReminders} onCheckedChange={setTaskReminders} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Reset to Default</Button>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>Manage your password and security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>
                <div className="flex items-center gap-4">
                  <Button variant="outline" className="gap-2">
                    <Lock className="h-4 w-4" />
                    Enable 2FA
                  </Button>
                  <Badge variant="outline" className="text-muted-foreground">
                    Not Enabled
                  </Badge>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Login Sessions</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your active sessions and sign out from other devices.
                </p>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">Windows 11 • Chrome • New York, USA</p>
                        <p className="text-xs text-muted-foreground">Started May 18, 2025 at 1:30 PM</p>
                      </div>
                      <Badge>Active Now</Badge>
                    </div>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="font-medium">Mobile App</p>
                        <p className="text-sm text-muted-foreground">iOS 17 • CRM App • San Francisco, USA</p>
                        <p className="text-xs text-muted-foreground">Started May 17, 2025 at 9:45 AM</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>Manage your team members and their access permissions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Team Members</h3>
                <Button size="sm" className="gap-2">
                  <Users className="h-4 w-4" />
                  Invite Member
                </Button>
              </div>

              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Budiono Siregar</p>
                        <p className="text-sm text-muted-foreground">budiono.sire@gmail.com</p>
                      </div>
                    </div>
                    <Badge>Admin</Badge>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Sarah Johnson</p>
                        <p className="text-sm text-muted-foreground">sarah.j@example.com</p>
                      </div>
                    </div>
                    <Select defaultValue="editor">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Michael Chen</p>
                        <p className="text-sm text-muted-foreground">michael.c@example.com</p>
                      </div>
                    </div>
                    <Select defaultValue="viewer">
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Role Permissions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-md border p-4 space-y-2">
                    <h4 className="font-medium">Admin</h4>
                    <p className="text-sm text-muted-foreground">Full access to all features and settings</p>
                  </div>
                  <div className="rounded-md border p-4 space-y-2">
                    <h4 className="font-medium">Editor</h4>
                    <p className="text-sm text-muted-foreground">Can edit contacts, leads, and tasks</p>
                  </div>
                  <div className="rounded-md border p-4 space-y-2">
                    <h4 className="font-medium">Viewer</h4>
                    <p className="text-sm text-muted-foreground">Read-only access to data</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Workflow Tab */}
        <TabsContent value="workflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Settings</CardTitle>
              <CardDescription>Configure your sales pipeline and workflow automation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sales Pipeline Stages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-md border p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Lead</h4>
                      <Badge variant="outline">Stage 1</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">New potential customers</p>
                  </div>
                  <div className="rounded-md border p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Qualified</h4>
                      <Badge variant="outline">Stage 2</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Leads that match criteria</p>
                  </div>
                  <div className="rounded-md border p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Proposal</h4>
                      <Badge variant="outline">Stage 3</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Sent offer or quote</p>
                  </div>
                  <div className="rounded-md border p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Closed</h4>
                      <Badge variant="outline">Stage 4</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Deal won or lost</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    Customize Pipeline
                  </Button>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Automation Rules</h3>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Lead Assignment</p>
                        <p className="text-sm text-muted-foreground">
                          Automatically assign new leads to team members based on territory
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Follow-up Reminders</p>
                        <p className="text-sm text-muted-foreground">
                          Create task reminders for leads with no activity for 3 days
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Deal Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Notify managers when deals over $10,000 are created
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    Add Automation Rule
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general application settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Date Format</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose how dates are displayed throughout the application.
                    </p>
                  </div>
                  <Select defaultValue="mm-dd-yyyy">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Date Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Time Format</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose how time is displayed throughout the application.
                    </p>
                  </div>
                  <Select defaultValue="12h">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Time Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Currency</Label>
                    <p className="text-sm text-muted-foreground">
                      Set the default currency for deals and transactions.
                    </p>
                  </div>
                  <Select defaultValue="usd">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                      <SelectItem value="cad">CAD ($)</SelectItem>
                      <SelectItem value="aud">AUD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">Choose the application theme.</p>
                  </div>
                  <Select defaultValue="system">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-refresh">Auto Refresh</Label>
                    <p className="text-sm text-muted-foreground">Automatically refresh data every 5 minutes.</p>
                  </div>
                  <Switch id="auto-refresh" defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="analytics">Usage Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow anonymous usage data collection to improve the application.
                    </p>
                  </div>
                  <Switch id="analytics" defaultChecked />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Management</h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Export your CRM data or request a data deletion.</p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="gap-2">
                      <Mail className="h-4 w-4" />
                      Export Data
                    </Button>
                    <Button variant="outline" className="text-destructive hover:text-destructive gap-2">
                      Request Data Deletion
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Reset to Default</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
