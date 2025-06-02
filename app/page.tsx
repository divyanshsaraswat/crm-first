"use client"

import { useState, useEffect } from "react"
import {
  BarChart3,
  Bell,
  ChevronDown,
  ChevronRight,
  ChevronsUpDownIcon,
  CreditCard,
  LayoutDashboard,
  LucideContact2,
  Pen,
  Pill,
  Settings,
  ShoppingBag,
  Tag,
  UserCheck2,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { Header } from "@/components/sidebar"

export default function Dashboard() {
  const [expanded, setExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [active, setActive] = useState<number>(0)
  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setExpanded(false)
      } else {
        setExpanded(true)
      }
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
        {/* Header */}
       <Header/>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome Code Astro!</h1>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Pharmacy Sales Results</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title="Today's" value="$95.00" change="+18%" trend="up" color="bg-emerald-50" />
                <StatsCard title="Available" value="1.457%" change="-1,9%" trend="down" color="bg-emerald-50" />
                <StatsCard title="Expired" value="0.48%" change="This Month" trend="neutral" color="bg-red-50" />
                <StatsCard title="Customers" value="255K" change="This Month" trend="neutral" color="bg-gray-50" />
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Graph Report</h2>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center">
                      <DonutChart value={75.5} />
                    </div>
                  </CardContent>
                </Card>
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Total Sales Overview</h2>
                  <div className="bg-emerald-800 text-white px-4 py-2 rounded-md font-semibold">$299.00</div>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <BarChartComponent />
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>
        </main>
      </div>
      </>

  )
}

function StatsCard({ title, value, change, trend, color }:any) {
  return (
    <motion.div
      className={cn("rounded-lg p-4", color)}
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p
        className={cn(
          "text-sm mt-1",
          trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500",
        )}
      >
        {change}
      </p>
    </motion.div>
  )
}

function DonutChart({ value }:any) {
  const percentage = value / 10
  const circumference = 2 * Math.PI * 50
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative flex items-center justify-center h-64 w-64">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle
          className="text-emerald-100"
          strokeWidth="12"
          stroke="currentColor"
          fill="transparent"
          r="50"
          cx="60"
          cy="60"
        />
        <circle
          className="text-emerald-500 transform -rotate-90 origin-center"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="50"
          cx="60"
          cy="60"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-sm font-medium text-gray-500">Total</span>
        <span className="text-3xl font-bold">755K</span>
      </div>
    </div>
  )
}

function BarChartComponent() {
  const data = [
    { value: 20, color: "bg-emerald-300" },
    { value: 15, color: "bg-emerald-200" },
    { value: 25, color: "bg-yellow-200" },
    { value: 30, color: "bg-red-200" },
    { value: 40, color: "bg-emerald-300" },
    { value: 35, color: "bg-gray-200" },
    { value: 50, color: "bg-emerald-300" },
  ]

  return (
    <div className="flex items-end justify-between h-48 gap-2">
      {data.map((item, index) => (
        <motion.div
          key={index}
          className={cn("rounded-full w-8", item.color)}
          initial={{ height: 0 }}
          animate={{ height: `${item.value * 2}px` }}
          transition={{
            duration: 0.8,
            delay: index * 0.1,
            type: "spring",
            stiffness: 100,
          }}
          whileHover={{ scale: 1.1 }}
        />
      ))}
    </div>
  )
}
