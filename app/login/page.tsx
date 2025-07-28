"use client"

import { AlertCircle, LoaderIcon, BarChart3, Sparkles, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
  onChange: (e: any) => void
  required?: boolean
  showPasswordToggle?: boolean
}) {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [inputType, setInputType] = useState(type)

  useState(() => {
    if (showPasswordToggle) {
      setInputType(showPassword ? "text" : "password")
    }
  }, [showPassword, showPasswordToggle])

  return (
    <div className="relative group">
      <input
        type={inputType}
        id={id}
        className={`w-full px-4 py-3 border-2 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none peer ${
          isFocused ? "border-emerald-500 shadow-lg shadow-emerald-500/20" : "border-slate-200 hover:border-emerald-300"
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
            ? "-top-2.5 text-xs bg-white px-2 text-emerald-600 font-medium rounded"
            : "top-3 text-slate-500"
        }`}
      >
        {label}
      </label>
      {showPasswordToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-slate-500 hover:text-emerald-600 z-20 cursor-pointer"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 pointer-events-none" />
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
  onChange: (e: any) => void
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
          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
            checked
              ? "bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-500"
              : "border-slate-300 group-hover:border-emerald-400 bg-white"
          }`}
        >
          {checked && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <label htmlFor={id} className="ml-3 text-sm text-slate-600 group-hover:text-slate-800 cursor-pointer">
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

  const handleSubmit = async (e: any) => {
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
      {/* Custom CSS for page fade-in animation */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .page-fade-in {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-xl" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full blur-xl" />
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 rounded-full blur-xl" />
      </div>

      {/* Background Patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-teal-400 rounded-full" />
          <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
        </div>
      </div>

      <div className="min-h-screen w-screen flex flex-col gap-6 items-center justify-center p-4 relative z-10 page-fade-in">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div
            className="flex items-center justify-center space-x-3 mb-4 group cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-slate-900 group-hover:text-emerald-600">ConvertCRM</span>
          </div>
          <p className="text-slate-600 text-lg">Welcome back to your dashboard</p>
        </div>

        {/* Error Alert */}
        {!login && failed && (
          <div>
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
        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-2">
                Log in
                <Sparkles className="w-5 h-5 text-emerald-500" />
              </h1>
              <p className="text-slate-600">Access your CRM dashboard</p>
            </div>

            {login && (
              <div className="flex flex-col gap-4 w-full items-center justify-center py-8">
                <div className="relative">
                  <LoaderIcon className="w-12 h-12 animate-spin text-emerald-500" />
                  <div className="absolute inset-0 w-12 h-12 border-4 border-emerald-200 rounded-full" />
                </div>
                <span className="text-sm text-slate-600 font-medium">Logging you in...</span>
                <div className="w-32 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full" />
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
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-xl hover:shadow-emerald-500/25 relative overflow-hidden group cursor-pointer"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 cursor-pointer">
                    Log in now
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100" />
                </button>
              </form>
            )}
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-20 group-hover:opacity-40" />
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full opacity-20 group-hover:opacity-40" />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} ConvertCRM. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
