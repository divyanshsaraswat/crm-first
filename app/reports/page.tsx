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
        

     
    </div>
  )
}
