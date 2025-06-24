'use client'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/sidebar"
import NestedTable from "@/components/nested"
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Loader2,
  User,
  Star,
  MessageSquare,
  Edit,
  MoreHorizontal,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { CrmAccountsEditModal } from "@/components/forms"

const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800"
    case "inactive":
      return "bg-red-100 text-red-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getRatingColor = (rating?: string) => {
  switch (rating?.toLowerCase()) {
    case "hot":
      return "bg-red-100 text-red-800"
    case "warm":
      return "bg-orange-100 text-orange-800"
    case "cold":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function AccountPage({ params }: PageProps) {
  const [data,setdata] = useState<any>({});
  const [loading,setloading] = useState<boolean>(false);
  useEffect(()=>{
    const fetchData = async () => {
      
          const { id } = await params;
          const token = await fetch('/api/session').then((res:any)=>{return res?.token}).catch((e)=>console.error(e))
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/accounts/${id}`,{
            credentials:'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': token
            }
          }).then(async(res)=>{
            const result = await res.json()
            setdata(result?.message)
            console.log(result)
            setloading(true)
        }).catch((e)=>{console.error(e)})
        }
        fetchData()
  },[])
  return (
    <div className="min-h-screen  max-w-8xl w-full px-8 py-1 pb-20 md:pb-6 ">
        <Header/>
      {!loading && <div className="flex flex-row items-center gap-2 w-full justify-center h-128">
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span className="text-gray-500">Loading...</span>
                      </div>}
      {loading && <div className="mx-auto max-w-7xl space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center space-x-4">
          <Link href="/accounts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Accounts
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
              <p className="text-gray-600">{data.BusinessNature}</p>
            </div>
          </div>
          {/* <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              <CrmAccountsEditModal data={data}/>
            </Button>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div> */}
        </div>

        {/* Status and Rating Badges */}
        <div className="flex items-center space-x-3">
          <Badge className={getStatusColor("Active")}>Active</Badge>
          {/* <Badge className={getRatingColor("Hot")}>
            <Star className="mr-1 h-3 w-3" />
            Hot
          </Badge> */}
          <Badge variant="outline">Source: {data.source_type}</Badge>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Contact Person</p>
                      <p className="text-sm text-gray-600"> {data.ContPerson}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Designation</p>
                      <p className="text-sm text-gray-600">CEO</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-gray-600">{data.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-gray-600">{data.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">WhatsApp</p>
                      <p className="text-sm text-gray-600">{data.waphone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Website</p>
                      <a
                        href= {'https://'+data.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {data.website}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{data.Address1}</p>
                  <p className="text-sm">{data.Address2}</p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span>Metropolis</span>
                    <span>, {data.City}</span>
                    <span>{data.Zip}</span>
                  </div>
                  <p className="text-sm font-medium">{(data.Country).toUpperCase()}</p>
                  <Badge variant="outline" className="mt-2">
                    Zone: {data.Zone}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Business Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="mr-2 h-5 w-5" />
                  Business Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Business Nature</p>
                    <p className="text-sm text-gray-600">{data.BusinessNature}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Joining Date</p>
                    <p className="text-sm text-gray-600">{data.JoiningDate?(data.JoiningDate).toLocaleDateString():'Not available'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Source</p>
                    <p className="text-sm text-gray-600">{data.source_type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="mr-2 h-5 w-5" />
                  Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 overflow-x-scroll">
                  <NestedTable did={data}/>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 flex  flex-col">
                <a href="mailto:example@example.com" className="hover:underline">
                <Button className="w-full hover:bg-gray-200" variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
                </a>
                <a href={`tel:919509333025`} className="hover:underline">
                <Button className="w-full hover:bg-gray-200" variant="outline">
                  <Phone className="mr-2 h-4 w-4" />
                  Make Call
                </Button>
                </a>
              </CardContent>
            </Card>

            {/* Account Details */}
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 text-sm">Account ID</span>
                  <span className="font-medium">{data.id}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 text-sm">Assigned User</span>
                  <span className="font-medium">{data.assigned_user_id}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 text-sm">Created By</span>
                  <span className="font-medium">{data.created_by_id}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium text-xs">{(data.updated_at).toString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>}
    </div>
  )
}
