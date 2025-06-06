"use client"

import { useState,useReducer, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Globe, Lock, Mail, Shield, User, Users, Workflow,Eye,Loader2 } from "lucide-react"
import { Header } from "@/components/sidebar"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type Preferences = {
  currency?: string;
  date_format?: string;
  notify_browser?: boolean;
  notify_email?: boolean;
  notify_lead_alerts?: boolean;
  notify_task_reminders?: boolean;
  theme?: string;
  time_format?: string;
};
type PreferencesAction =
  | { type: "SET_ALL"; payload: Preferences }
  | { type: "UPDATE"; payload: Partial<Preferences> };
export default function SettingsPage() {

const preferencesReducer = (state: Preferences, action: PreferencesAction): Preferences => {
  switch (action.type) {
    case "SET_ALL":
      return { ...action.payload };
    case "UPDATE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
 const router = useRouter();
 const [preferences, dispatch] = useReducer(preferencesReducer, {});
 const [data,setdata] = useState<any>({});
 const [pass,setpass] = useState<string>();
 const [cpass,setcpass] = useState<string>();
 const [loading,setloading] = useState<boolean>(true);
 const saveprofile = async(values:any)=>{
   const fetchData = async () => {
          console.log({...values,id:data?.id});
          const token = await fetch('/api/session').then((res:any)=>{return res?.token}).catch((e)=>console.error(e))
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/`,{
            credentials:'include',
            method:"PUT",
            headers: {
                'Content-Type': 'application/json',
                'Cookie': token
            },
            body: JSON.stringify({...values,id:data?.id})
          }).then(async(res)=>{
            toast("✅ Data Updated Successfully.")
        }).catch((e)=>{console.error(e)})
        }
    fetchData();
 }
 const forgotpassword = async(values:any)=>{
   const fetchData = async () => {
          const token = await fetch('/api/session').then((res:any)=>{return res?.token}).catch((e)=>console.error(e))
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/forgot`,{
            credentials:'include',
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
                'Cookie': token
            },
            body: JSON.stringify(values)
          }).then(async(res)=>{
            if (res.status==200){

              toast("✅ Password Updated Successfully.")
            }
            if (res.status==403){
              toast("❌ Current Password is incorrect.");
                
            }
        }).catch((e)=>{console.error(e)})
        }
    fetchData();
 }
 const savepreferences = async(values:any)=>{
   const fetchData = async () => {
          const token = await fetch('/api/session').then((res:any)=>{return res?.token}).catch((e)=>console.error(e))
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/settings`,{
            credentials:'include',
            method:"PUT",
            headers: {
                'Content-Type': 'application/json',
                'Cookie': token
            },
            body: JSON.stringify(preferences)
          }).then(async(res)=>{
            if (res.status==200){

              toast("✅ Saved Successfully.")
            }
            else{
              toast("❌ Some Error Occured.");
                
            }
        }).catch((e)=>{console.error(e)})
        }
    console.log("Preferences",preferences);
    fetchData();
 }
  const roles = [
    {
      name: "Admin",
      icon: Shield,
      color: "bg-red-50 text-red-700 border-red-200",
      badgeColor: "bg-red-100 text-red-800",
      permissions: [
        "Full system access",
        "User management",
        "Role assignments",
        "System configuration",
        "Data export/import",
        "Security settings",
        "Audit logs access",
        "Billing management",
      ],
    },
    {
      name: "Manager",
      icon: Users,
      color: "bg-blue-50 text-blue-700 border-blue-200",
      badgeColor: "bg-blue-100 text-blue-800",
      permissions: [
        "Team management",
        "Project oversight",
        "Report generation",
        "Task assignment",
        "Performance analytics",
        "Resource allocation",
        "Team scheduling",
        "Budget tracking",
      ],
    },
    {
      name: "User",
      icon: Eye,
      color: "bg-green-50 text-green-700 border-green-200",
      badgeColor: "bg-green-100 text-green-800",
      permissions: [
        "View assigned tasks",
        "Update task status",
        "Access personal dashboard",
        "Submit time entries",
        "View team calendar",
        "Download reports",
        "Profile management",
        "Basic notifications",
      ],
    },
  ]
  useEffect(() => {
    const loadPreferences = () => {
      const stored = localStorage.getItem("preferences");

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const {
            currency,
            date_format,
            notify_browser,
            notify_email,
            notify_lead_alerts,
            notify_task_reminders,
            theme,
            time_format,
          } = parsed;

          dispatch({
            type: "SET_ALL",
            payload: {
              currency,
              date_format,
              notify_browser,
              notify_email,
              notify_lead_alerts,
              notify_task_reminders,
              theme,
              time_format,
            },
          });
        } catch (e) {
          console.error("Failed to parse preferences from localStorage", e);
        }
      }
    };
     const fetchData = async () => {
          
          const token = await fetch('/api/session').then((res:any)=>{return res?.token}).catch((e)=>console.error(e))
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/details`,{
            credentials:'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': token
            }
          }).then(async(res)=>{
            const result = await res.json()
            setdata(result[0][0])
            setloading(false);
        }).catch((e)=>{console.error(e)})
        }
    fetchData()
    loadPreferences();
  }, []);
  return (
        <div className="flex-1 flex flex-col  overflow-scroll bg-transparent" style={{scrollbarWidth:"none"}}>
        <Header/>
        <div className="px-8 py-5">
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
          {/* <TabsTrigger value="workflow" className="flex items-center gap-2 py-2">
            <Workflow className="h-4 w-4" />
            <span className="hidden md:inline">Workflow</span>
          </TabsTrigger> */}
          <TabsTrigger value="general" className="flex items-center gap-2 py-2">
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">General</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">

          {!loading && <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account profile information and email address.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const values = {
                  username: formData.get('name'),
                  email: formData.get('email'),
                  role: formData.get('title')
                };
                saveprofile(values);
                }} className="space-y-6">

                <div className="flex flex-col md:flex-row gap-6">
                <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                  id="name" 
                  name="name"
                  defaultValue={data.username}
                  required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                  id="email"
                  name="email" 
                  type="email" 
                  defaultValue={data.email}
                  required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input 
                  id="title"
                  name="title"
                  defaultValue={data.role}
                  required
                  />
                </div>
                </div>
                </div>
                <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.refresh()}>
                Cancel
                </Button>
                <Button type="submit">
                Save Changes
                </Button>
                </div>
                </form>
            </CardContent>
          </Card>
          }
          {loading && <div className="flex flex-row items-center gap-2 justify-center h-64">
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span className="text-gray-500">Loading...</span>
                      </div>}
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
                    checked={preferences.notify_email}
                    onCheckedChange={()=>dispatch({ type: "UPDATE", payload: { notify_email: !(preferences.notify_email) } })}
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
                    checked={preferences.notify_browser}
                    onCheckedChange={()=>dispatch({ type: "UPDATE", payload: { notify_browser: !(preferences.notify_browser) } })}
                  />
                </div>
                {/* <Separator /> */}
                {/* <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-reports">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive a weekly summary of your CRM activity.</p>
                  </div>
                  <Switch id="weekly-reports" checked={weeklyReports} onCheckedChange={setWeeklyReports} />
                </div> */}
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="lead-alerts">Lead Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when new leads are assigned to you.</p>
                  </div>
                  <Switch id="lead-alerts" checked={preferences.notify_lead_alerts} onCheckedChange={()=>dispatch({ type: "UPDATE", payload: { notify_lead_alerts: !(preferences.notify_lead_alerts) } })} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="task-reminders">Task Reminders</Label>
                    <p className="text-sm text-muted-foreground">Receive reminders for upcoming and overdue tasks.</p>
                  </div>
                  <Switch id="task-reminders" checked={preferences.notify_task_reminders} onCheckedChange={()=>dispatch({ type: "UPDATE", payload: { notify_task_reminders: !(preferences.notify_task_reminders) } })} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={()=>router.refresh()}>Reset to Default</Button>
              <Button onClick={savepreferences}>Save Preferences</Button>
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
              <form onSubmit={(e) => {
              e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const newPassword = formData.get('new-password')?.toString();
            const confirmPassword = formData.get('confirm-password')?.toString();
            const currentPassword = formData.get('current-password')?.toString();

            if (!currentPassword?.trim()) {
              toast("❌ Current password is required");
              return;
            }

            if (!newPassword?.trim() || !confirmPassword?.trim()) {
              toast("❌ New password and confirmation are required");
              return;
            }

            if (newPassword !== confirmPassword) {
              toast("❌ New Passwords do not match");
              return;
            }

            if (newPassword.length < 6) {
              toast("❌ New Password must be at least 6 characters long");
              return;
            }
              const values = {
                password: formData.get('confirm-password'),
                oldpassword: formData.get('current-password'),
                id: data?.id
              };
              forgotpassword(values);
              }} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input 
                  id="current-password" 
                  name="current-password"
                  type="password" 
                  required
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input 
                  id="new-password" 
                  name="new-password"
                  type="password" 
                  required
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input 
                  id="confirm-password" 
                  name="confirm-password"
                  type="password" 
                  required
                />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => {
                    router.refresh()
                }}>Cancel</Button>
                <Button type="submit">Update Password</Button>
              </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>Here are the permissions for the following available roles:</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Team Members</h3>
                <Button size="sm" className="gap-2">
                  <Users className="h-4 w-4" />
                  Invite Member
                </Button>
              </div> */}

              {/* <div className="space-y-4">
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

              <Separator className="my-4" /> */}

              {/* <div className="space-y-4">
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
              </div> */}


              {roles.map((role) => {
          const IconComponent = role.icon
          return (
            <Card
              key={role.name}
              className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${role.color}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-5 w-5" />
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                  </div>
                  <Badge variant="secondary" className={role.badgeColor}>
                    {role.permissions.length} permissions
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2">
                  {role.permissions.map((permission, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-current mt-2 flex-shrink-0" />
                      <span className="leading-relaxed">{permission}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
            </CardContent>
            {/* <CardFooter className="flex justify-end gap-2">
              <Button>Save Changes</Button>
            </CardFooter> */}
          </Card>
        </TabsContent>

        {/* Workflow Tab */}
        {/* <TabsContent value="workflow" className="space-y-6">
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
        </TabsContent> */}

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
                  <Select defaultValue={preferences?.date_format} onValueChange={(e)=>dispatch({ type: "UPDATE", payload: { date_format: e } })}>
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
                    <Select defaultValue={preferences?.time_format} onValueChange={(e)=>dispatch({ type: "UPDATE", payload: { time_format: e } })}>
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
                    <Select defaultValue={preferences?.currency?.toLowerCase()} onValueChange={(e)=>dispatch({ type: "UPDATE", payload: { currency: e } })}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inr">INR (₹)</SelectItem>
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
                    <Select defaultValue={preferences?.theme} onValueChange={(e)=>dispatch({ type: "UPDATE", payload: { theme: e } })} >
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

                
                {/* <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="analytics">Usage Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow anonymous usage data collection to improve the application.
                    </p>
                  </div>
                  <Switch id="analytics" defaultChecked />
                </div> */}
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
              <Button variant="outline" onClick={()=>router.refresh()}>Reset to Default</Button>
              <Button onClick={savepreferences}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}
