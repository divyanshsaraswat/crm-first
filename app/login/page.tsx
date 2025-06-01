"use client"
import { LoaderIcon } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type React from "react"

export default function LoginPage() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })
  const [login, setLogin] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLogin(true)
    
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/login`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(credentials),
      headers: { "Content-Type": "application/json" },
    })

    if (result.ok) {
      window.location.href = "/contacts"
    } else {
      const data = await result.json() 
      alert(data.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 className="text-xl font-medium mb-6">Log in</h1>
      {login && <div className="flex flex-col gap-2 w-full items-center justify-center">
       <LoaderIcon className=" w-12 h-12 animate-spin text-blue-500" />
        <span className="text-sm text-gray-500 italic">Logging in...</span>
      </div>}
    {!login && <div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <input type="checkbox" id="remember" className="mr-2" />
            <label htmlFor="remember" className="text-sm text-gray-600">
              Keep me logged in
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Log in now
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <a href="#" className="text-gray-600 hover:underline">
            Create new account
          </a>
          <span className="mx-2 text-gray-400">|</span>
          <a href="#" className="text-gray-600 hover:underline">
            Forgot password
          </a>
        </div>

        <div className="mt-6">
          <div className="text-center text-sm text-gray-500 mb-3">Or continue with</div>

          <button
            type="button"
            className="w-full bg-red-600 text-white font-medium py-2 px-4 rounded-md mb-2 flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
            </svg>
            Sign In With Google
          </button>

          

          <button
            type="button"
            className="w-full bg-gray-800 text-white font-medium py-2 px-4 rounded-md mb-2 flex items-center justify-center hover:bg-gray-900 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
            </svg>
            Sign In With Microsoft
          </button>


          <button
            type="button"
            className="w-full bg-white font-medium py-2 px-4 rounded-md mb-2 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer border-1 border-black"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="black" viewBox="0 0 24 24">
              <path d="M17.0825 12.0614C17.0654 10.1866 18.5918 9.10338 18.6724 9.05052C17.7825 7.73663 16.3722 7.56142 15.8793 7.54309C14.6891 7.41822 13.5373 8.24354 12.9326 8.24354C12.3137 8.24354 11.3561 7.56006 10.3452 7.58247C9.05342 7.60488 7.86751 8.3377 7.21485 9.47858C5.85601 11.8198 6.85708 15.2131 8.16409 17.0457C8.81947 17.9382 9.58331 18.9393 10.5914 18.9026C11.5725 18.866 11.9386 18.2866 13.1215 18.2866C14.2901 18.2866 14.6342 18.9026 15.6575 18.8806C16.7095 18.866 17.3764 17.9793 18.0171 17.0795C18.7809 16.0564 19.0851 15.0546 19.1022 14.9994C19.0851 14.9847 17.1017 14.2741 17.0825 12.0614Z"/>
              <path d="M15.3868 5.99354C15.9259 5.33982 16.2961 4.43169 16.2031 3.5C15.4099 3.53509 14.4492 4.00743 13.8905 4.64282C13.3905 5.20847 12.9425 6.14828 13.0527 7.04839C13.9399 7.12391 14.8477 6.64743 15.3868 5.99354Z"/>
            </svg>
            Sign In With Apple
          </button>

        </div>
        </div>}
      </div>
    </div>
  )
}
