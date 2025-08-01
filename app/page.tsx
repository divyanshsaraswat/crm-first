"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  BarChart3,
  Users,
  TrendingUp,
  Zap,
  Shield,
  Clock,
  Target,
  CheckCircle,
  Star,
  Play,
  Menu,
  X,
  MessageCircle,
  Send,
  Heart,
  Sparkles,
  Bot,
  User,
  ArrowUp,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Animated Counter Component with scroll trigger
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // Advanced easing with bounce
      const easeOutBounce = (t: number) => {
        if (t < 1 / 2.75) {
          return 7.5625 * t * t
        } else if (t < 2 / 2.75) {
          return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
        } else if (t < 2.5 / 2.75) {
          return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
        } else {
          return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375
        }
      }

      setCount(Math.floor(easeOutBounce(progress) * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <span ref={ref} className="inline-block">
      {count}
      {suffix}
    </span>
  )
}

// Interactive Chat Demo Component
function InteractiveChatDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [messages, setMessages] = useState<
    Array<{
      id: number
      type: "user" | "agent" | "system"
      content: string
      timestamp: string
      satisfaction?: number
      isTyping?: boolean
    }>
  >([])

  const chatSteps = [
    {
      title: "Before CRM: Slow Response Times",
      messages: [
        { id: 1, type: "user" as const, content: "Hi, I'm interested in your product pricing", timestamp: "2:30 PM" },
        { id: 2, type: "system" as const, content: "Customer waiting...", timestamp: "2:30 PM" },
        {
          id: 3,
          type: "agent" as const,
          content: "Hello! Let me check that for you...",
          timestamp: "2:45 PM",
          isTyping: true,
        },
        {
          id: 4,
          type: "user" as const,
          content: "Still waiting for pricing info",
          timestamp: "3:15 PM",
          satisfaction: 2,
        },
      ],
    },
    {
      title: "After CRM: Instant Smart Responses",
      messages: [
        { id: 1, type: "user" as const, content: "Hi, I'm interested in your product pricing", timestamp: "2:30 PM" },
        {
          id: 2,
          type: "agent" as const,
          content:
            "Hi there! 👋 I'd be happy to help with pricing. Based on your company size, here are our recommended plans:",
          timestamp: "2:30 PM",
        },
        {
          id: 3,
          type: "agent" as const,
          content:
            "✨ Starter: $49/month\n🚀 Professional: $99/month\n💎 Enterprise: Custom pricing\n\nWhich plan interests you most?",
          timestamp: "2:30 PM",
        },
        {
          id: 4,
          type: "user" as const,
          content: "The Professional plan looks perfect! How do I get started?",
          timestamp: "2:31 PM",
          satisfaction: 5,
        },
        {
          id: 5,
          type: "agent" as const,
          content: "Excellent choice! I can set up a free trial right now. What's your email address?",
          timestamp: "2:31 PM",
        },
      ],
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % chatSteps.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setMessages([])
    const currentMessages = chatSteps[currentStep].messages

    currentMessages.forEach((message, index) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, message])
      }, index * 1000)
    })
  }, [currentStep])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">{chatSteps[currentStep].title}</h3>
        <div className="flex justify-center space-x-2">
          {chatSteps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                index === currentStep ? "bg-emerald-500 scale-125" : "bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold">Customer Support</h4>
              <p className="text-sm text-emerald-100">
                Online • Avg response: {currentStep === 0 ? "15 min" : "30 sec"}
              </p>
            </div>
            <div className="ml-auto">
              {currentStep === 1 && (
                <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                  <Bot className="w-4 h-4" />
                  <span className="text-xs">AI-Powered</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-slideInUp`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.type === "user"
                    ? "bg-emerald-500 text-white rounded-br-md"
                    : message.type === "system"
                      ? "bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-200"
                      : "bg-white text-slate-800 rounded-bl-md shadow-md border border-slate-200"
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.type === "agent" && (
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      {currentStep === 1 ? (
                        <Bot className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <User className="w-3 h-3 text-emerald-600" />
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${message.type === "user" ? "text-emerald-100" : "text-slate-500"}`}>
                        {message.timestamp}
                      </span>
                      {message.satisfaction && (
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < message.satisfaction! ? "text-yellow-400 fill-current" : "text-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {message.isTyping && (
                  <div className="flex space-x-1 mt-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex items-center space-x-3">
            <Input
              placeholder="Type your message..."
              className="flex-1 border-slate-300 focus:border-emerald-500"
              disabled
            />
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600" disabled>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Comparison */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card
          className={`transition-all duration-500 ${currentStep === 0 ? "ring-2 ring-red-200 bg-red-50" : "opacity-60"}`}
        >
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-red-500" />
            </div>
            <h4 className="font-bold text-red-600 mb-2">Traditional Approach</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Response Time:</span>
                <span className="font-bold text-red-600">15 minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Customer Satisfaction:</span>
                <span className="font-bold text-red-600">2/5 ⭐</span>
              </div>
              <div className="flex justify-between">
                <span>Conversion Rate:</span>
                <span className="font-bold text-red-600">12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`transition-all duration-500 ${currentStep === 1 ? "ring-2 ring-emerald-200 bg-emerald-50" : "opacity-60"}`}
        >
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-emerald-500" />
            </div>
            <h4 className="font-bold text-emerald-600 mb-2">With ConvertCRM</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Response Time:</span>
                <span className="font-bold text-emerald-600">30 seconds</span>
              </div>
              <div className="flex justify-between">
                <span>Customer Satisfaction:</span>
                <span className="font-bold text-emerald-600">5/5 ⭐</span>
              </div>
              <div className="flex justify-between">
                <span>Conversion Rate:</span>
                <span className="font-bold text-emerald-600">47%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CRMLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [emailed,setemailed] = useState(true)
  const [email,setemail] = useState<string>('');
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const sendEmail = async(e:any)=>{
    e.preventDefault()
   
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/mailtrial`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({email:email}),
      headers: { "Content-Type": "application/json" },
    })

    if (result.ok) {
     setemailed(false);
    } else {
      alert("Some error have occured. Try again!")
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white overflow-hidden">
      {/* Custom CSS for complex animations */}
      <style jsx global>{`
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
        
        @keyframes morphBounce {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(5deg); }
          50% { transform: scale(0.95) rotate(-3deg); }
          75% { transform: scale(1.05) rotate(2deg); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(1deg); }
          50% { transform: translateY(-5px) rotate(-1deg); }
          75% { transform: translateY(-15px) rotate(0.5deg); }
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
        }
        
        .animate-morphBounce {
          animation: morphBounce 2s ease-in-out infinite;
        }
        
        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Enhanced Header */}
      <header className="fixed top-0 w-full bg-white/99 border-b border-slate-200 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors duration-300">
              ConvertCRM
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {["Features", "Benefits", "Pricing", "Demo"].map((item, index) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-slate-600 hover:text-emerald-600 transition-all duration-300 relative group"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300"
              onClick={() => router.push("/login")}
            >
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group">
              <span className="relative z-10">Start Free Trial</span>
              <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100"></div>
            </Button>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden">
          <div className="fixed top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-xl">
            <nav className="container mx-auto px-4 py-6">
              <div className="flex flex-col space-y-4">
                {["Features", "Benefits", "Pricing", "Demo"].map((item) => (
                  <Link
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-slate-600 hover:text-emerald-600 transition-colors duration-300 py-2 text-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
                <div className="border-t border-slate-200 pt-4 mt-4 space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300 justify-start"
                    onClick={() => {
                      router.push("/login")
                      setIsMenuOpen(false)
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Start Free Trial
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Enhanced Hero Section */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full" />
          <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full" />
          <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 rounded-full" />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Transform Leads Into
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent relative">
                {" "}
                Loyal Customers
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-8 h-8 text-emerald-500 animate-pulse" />
                </div>
              </span>
            </h1>

            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Our intelligent CRM platform increases your conversion rates by up to 340% while reducing manual work by
              75%. Stop losing potential customers and start growing your revenue.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg border-2 border-slate-300 hover:border-emerald-500 hover:text-emerald-600 transition-all duration-300 group relative overflow-hidden bg-transparent"
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-125 transition-transform duration-300" />
                <span className="relative z-10">Watch Demo</span>
                <div className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>

            <div className="text-sm text-slate-500 flex items-center justify-center space-x-4">
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-1" />
                No credit card required
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-1" />
                14-day free trial
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-1" />
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-12 bg-gradient-to-r from-emerald-50 to-teal-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 to-teal-100/30" />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 px-8">
            {[
              { end: 340, suffix: "%", label: "Conversion Increase", icon: TrendingUp },
              { end: 75, suffix: "%", label: "Time Saved", icon: Clock },
              { end: 98, suffix: "%", label: "Customer Satisfaction", icon: Heart },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center group hover:scale-110 transition-all duration-500 cursor-pointer bg-white/50 rounded-2xl p-6 shadow-lg"
              >
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto group-hover:shadow-xl transition-shadow duration-300">
                    <stat.icon className="w-8 h-8 text-emerald-600 group-hover:scale-125 transition-transform duration-300" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-emerald-600 mb-2">
                  {/* {stat.prefix} */}
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                </div>
                <div className="text-slate-600 font-medium group-hover:text-emerald-700 transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                {" "}
                Convert More
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our comprehensive CRM platform combines smart automation with proven conversion strategies
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Smart Lead Scoring",
                description:
                  "Smart algorithms automatically identify your hottest prospects, increasing close rates by 45%",
                color: "from-emerald-500 to-teal-600",
              },
              {
                icon: Zap,
                title: "Automated Follow-ups",
                description:
                  "Never miss a follow-up again. Automated sequences that feel personal and convert 3x better",
                color: "from-teal-500 to-cyan-600",
              },
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                description: "Track every interaction and optimize your sales process with actionable insights",
                color: "from-cyan-500 to-blue-600",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Seamless handoffs between marketing and sales teams, reducing lead drop-off by 60%",
                color: "from-blue-500 to-indigo-600",
              },
              {
                icon: Shield,
                title: "Data Security",
                description: "Enterprise-grade security with SOC 2 compliance and 99.9% uptime guarantee",
                color: "from-indigo-500 to-purple-600",
              },
              {
                icon: Clock,
                title: "Time-saving Automation",
                description:
                  "Automate repetitive tasks and focus on what matters - closing deals and building relationships",
                color: "from-purple-500 to-pink-600",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 border-0 shadow-lg relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="relative mb-6">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-xl`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping"></div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Chat Demo Section */}
      <section id="demo" className="py-20 bg-gradient-to-br from-slate-50 to-emerald-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50" />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6">
              See ConvertCRM in Action
              <span className="inline-block ml-2">
                <MessageCircle className="w-12 h-12 text-emerald-500 animate-bounce" />
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Watch how our intelligent chat system transforms customer interactions and boosts satisfaction
            </p>
          </div>
          <InteractiveChatDemo />
        </div>
      </section>

      {/* Enhanced Benefits Comparison */}
      <section id="benefits" className="py-20 bg-gradient-to-br from-slate-50 to-emerald-50 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6">See the Difference ConvertCRM Makes</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Compare your current results with what you could achieve using our platform
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Without ConvertCRM */}
            <Card className="border-2 border-red-200 shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100 opacity-50"></div>
              <CardContent className="p-8 relative z-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-600 mb-2">Without ConvertCRM</h3>
                  <p className="text-slate-600">Traditional sales approach</p>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Lead Conversion Rate", value: "2.3%" },
                    { label: "Time Spent on Admin", value: "6 hours/day" },
                    { label: "Follow-up Response Rate", value: "12%" },
                    { label: "Monthly Revenue", value: "$50,000" },
                    { label: "Customer Lifetime Value", value: "$2,400" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-300 transform hover:scale-105"
                    >
                      <span className="text-slate-700">{item.label}</span>
                      <span className="font-bold text-red-600">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* With ConvertCRM */}
            <Card className="border-2 border-emerald-200 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-600 text-white px-4 py-2 text-sm font-bold animate-pulse">
                RECOMMENDED
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-50"></div>
              <CardContent className="p-8 relative z-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-600 mb-2">With ConvertCRM</h3>
                  <p className="text-slate-600">Smart sales optimization</p>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Lead Conversion Rate", value: "10.1%", improvement: "+340%" },
                    { label: "Time Spent on Admin", value: "1.5 hours/day", improvement: "-75%" },
                    { label: "Follow-up Response Rate", value: "38%", improvement: "+217%" },
                    { label: "Monthly Revenue", value: "$175,000", improvement: "+250%" },
                    { label: "Customer Lifetime Value", value: "$7,200", improvement: "+200%" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-all duration-300 group/item transform hover:scale-105"
                    >
                      <span className="text-slate-700">{item.label}</span>
                      <div className="flex items-center">
                        <span className="font-bold text-emerald-600">{item.value}</span>
                        <Badge className="ml-2 bg-emerald-100 text-emerald-700 group-hover/item:scale-110 transition-transform duration-300">
                          {item.improvement}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group cursor-pointer">
              <TrendingUp className="mr-3 w-6 h-6 group-hover:scale-125 transition-transform duration-300" />
              <span>Potential Additional Revenue: $1,500,000/year</span>
              <Sparkles className="ml-3 w-6 h-6 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full" />
        </div>

        <div className="container mx-auto px-4 lg:px-6 text-center relative z-10">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Ready to 3x Your Conversion Rate?</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using ConvertCRM to transform their sales results. Start your free
            trial today - no credit card required.
          </p>

          {emailed &&  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center bg-white/20 rounded-lg p-1 max-w-md w-full group hover:bg-white/30 transition-colors duration-300">
              <Input
                type="email"
                placeholder="Enter your business email"
                className="border-0 bg-transparent text-white placeholder:text-emerald-100 focus:ring-0"
              />
              <Button className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold px-6 ml-2 transform hover:scale-105 transition-all duration-300" onClick={sendEmail}>
                Start Free Trial
              </Button>
            </div>
          </div> }

          <div className="text-emerald-100 text-sm flex items-center justify-center space-x-4">
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              14-day free trial
            </span>
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              No setup fees
            </span>
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Cancel anytime
            </span>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-slate-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="text-center">
            <div className="group cursor-pointer inline-block">
              <div className="flex items-center justify-center space-x-4 mb-6 group-hover:scale-110 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500/20 to-teal-600/20 rounded-2xl flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-emerald-500/40 group-hover:to-teal-600/40 transition-all duration-500 border border-emerald-500/20 group-hover:border-emerald-500/40">
                  <BarChart3 className="w-8 h-8 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300" />
                </div>
                <span className="text-4xl font-bold text-emerald-400/60 group-hover:text-emerald-300 transition-all duration-300">
                  ConvertCRM
                </span>
              </div>
              <p className="text-slate-500 max-w-md mx-auto opacity-60 group-hover:opacity-80 transition-opacity duration-300">
                Transform your sales process with intelligent automation that actually converts.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} ConvertCRM. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        className={`fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform z-50 ${
          scrollY > 500 ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp className="w-6 h-6 mx-auto" />
      </button>
    </div>
  )
}
