"use client"

import { AlertCircle, LoaderIcon, BarChart3, Sparkles, Eye, EyeOff } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type React from "react"

// Floating Animation Component
function FloatingElement({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div
      className="animate-float"
      style={{
        animationDelay: `${delay}s`,
        animation: `float 6s ease-in-out infinite ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

// Parallax Element Component
function ParallaxElement({
  children,
  speed = 0.5,
  className = "",
}: {
  children: React.ReactNode
  speed?: number
  className?: string
}) {
  const [offset, setOffset] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const scrolled = window.scrollY
      const rate = scrolled * speed
      setOffset(rate)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${offset}px)`,
      }}
    >
      {children}
    </div>
  )
}

// Animated Input Component
function AnimatedInput({
  label,
  type = "text",
  id,
  value,
  onChange,
  required = false,
  showPasswordToggle = false,
}: {
  label: string
  type?: string
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  showPasswordToggle?: boolean
}) {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [inputType, setInputType] = useState(type)

  useEffect(() => {
    if (showPasswordToggle) {
      setInputType(showPassword ? "text" : "password")
    }
  }, [showPassword, showPasswordToggle])

  return (
    <div className="relative group">
      <input
        type={inputType}
        id={id}
        className={`w-full px-4 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none peer ${
          isFocused
            ? "border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105"
            : "border-slate-200 hover:border-emerald-300"
        } ${value ? "border-emerald-400" : ""}`}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        placeholder=" "
      />
      <label
        htmlFor={id}
        className={`absolute left-3 transition-all duration-300 pointer-events-none z-10 ${
          isFocused || value
            ? "-top-2.5 text-xs bg-white px-2 text-emerald-600 font-medium rounded scale-105"
            : "top-3 text-slate-500"
        }`}
      >
        {label}
      </label>
      {showPasswordToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-slate-500 hover:text-emerald-600 transition-colors duration-300 z-20 cursor-pointer"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  )
}

// Animated Checkbox Component
function AnimatedCheckbox({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div
      className="flex items-center group cursor-pointer"
      onClick={() => {
        const checkbox = document.getElementById(id) as HTMLInputElement
        if (checkbox) {
          checkbox.click()
        }
      }}
    >
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="absolute opacity-0 w-5 h-5 cursor-pointer z-10"
        />
        <div
          className={`w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center ${
            checked
              ? "bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-500 scale-110"
              : "border-slate-300 group-hover:border-emerald-400 bg-white"
          }`}
        >
          {checked && (
            <svg
              className="w-3 h-3 text-white animate-in zoom-in duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <label
        htmlFor={id}
        className="ml-3 text-sm text-slate-600 group-hover:text-slate-800 transition-colors duration-300 cursor-pointer"
      >
        {label}
      </label>
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })
  const [login, setLogin] = useState(false)
  const [failed, setFailed] = useState(false)
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Mouse tracking for subtle parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLogin(true)
    setFailed(false)

    const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/login`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(credentials),
      headers: { "Content-Type": "application/json" },
    })

    if (result.ok) {
      window.location.href = "/accounts"
    } else {
      setLogin(false)
      setFailed(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 relative overflow-hidden">
      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(1deg); }
          50% { transform: translateY(-5px) rotate(-1deg); }
          75% { transform: translateY(-15px) rotate(0.5deg); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
        }
      `}</style>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingElement delay={0}>
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-xl" />
        </FloatingElement>
        <FloatingElement delay={2}>
          <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full blur-xl" />
        </FloatingElement>
        <FloatingElement delay={4}>
          <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 rounded-full blur-xl" />
        </FloatingElement>
      </div>

      {/* Parallax Background Patterns */}
      <ParallaxElement speed={0.1} className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <div
            className="absolute top-1/3 right-1/3 w-1 h-1 bg-teal-400 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>
      </ParallaxElement>

      <div className="min-h-screen w-screen flex flex-col gap-6 items-center justify-center p-4 relative z-10 cursor-pointer" onClick={()=>router.push('/')}>
        {/* Logo Section */}
        <div className="text-center mb-8 animate-slideInUp">
          <div className="flex items-center justify-center space-x-3 mb-4 group">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors duration-300">
              ConvertCRM
            </span>
          </div>
          <p className="text-slate-600 text-lg">Welcome back to your dashboard</p>
        </div>

        {/* Error Alert */}
        {!login && failed && (
          <div className="animate-slideInUp" style={{ animationDelay: "0.2s" }}>
            <Alert variant="destructive" className="w-96 border-red-200 bg-red-50/80 backdrop-blur-sm shadow-lg">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-red-700">Login Failed!</AlertTitle>
              <AlertDescription className="text-red-600">
                Your login credentials are incorrect, please try again!
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Login Form */}
        <div
          className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 relative overflow-hidden group animate-slideInUp"
          style={{
            animationDelay: "0.4s",
            transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight / 2) * 0.01}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) * 0.01}deg)`,
          }}
        >
          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-2">
                Log in
                <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" />
              </h1>
              <p className="text-slate-600">Access your CRM dashboard</p>
            </div>

            {login && (
              <div className="flex flex-col gap-4 w-full items-center justify-center py-8 animate-slideInUp">
                <div className="relative">
                  <LoaderIcon className="w-12 h-12 animate-spin text-emerald-500" />
                  <div className="absolute inset-0 w-12 h-12 border-4 border-emerald-200 rounded-full animate-pulse" />
                </div>
                <span className="text-sm text-slate-600 font-medium">Logging you in...</span>
                <div className="w-32 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full animate-pulse" />
                </div>
              </div>
            )}

            {!login && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <AnimatedInput
                    label="Email"
                    type="email"
                    id="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    required
                  />

                  <AnimatedInput
                    label="Password"
                    type="password"
                    id="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                    showPasswordToggle
                  />
                </div>

                <AnimatedCheckbox
                  id="remember"
                  label="Keep me logged in"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                />

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 cursor-pointer">
                    Log in now
                    <Sparkles className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100" />
                </button>
              </form>
            )}
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500 animate-slideInUp" style={{ animationDelay: "0.6s" }}>
          <p>© {new Date().getFullYear()} ConvertCRM. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
