"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeClosed, UserPlus,Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import Flag from 'react-world-flags'
import { Button } from "@/components/ui/button"
import { Portal } from "@radix-ui/react-popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Label } from "./ui/label"
import { toast } from "sonner"

const formContactSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "10-digit Phone is required"),
  account_id: z.string().min(1, "Account ID is required"),
})
const formContactEditSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "10-digit Phone is required"),
  account_id: z.string().min(1, "Account ID is required"),
})

const formTaskSchema = z.object({
  subject: z.string().min(3, {
    message: "Subject must be at least 3 characters.",
  }),

  body: z.string().min(5, {
    message: "Body must be at least 5 characters.",
  }),

  status: z.string({
    required_error: "Please select a status.",
  }),

  due_date: z.coerce.date({
    required_error: "Please select a due date.",
  }),

  contact_id: z.string({
    required_error: "Please select a contact.",
  }),
  assigned_user_id :z.string()
});
const formTaskEditSchema = z.object({
  id:z.string(),
  subject: z.string().min(3, {
    message: "Subject must be at least 3 characters.",
  }),

  body: z.string().min(5, {
    message: "Body must be at least 5 characters.",
  }),

  status: z.string({
    required_error: "Please select a status.",
  }),

  due_date: z.coerce.date({
    required_error: "Please select a due date.",
  }),

  assigned_user_id :z.string()
});

const formUsersSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),

  email: z.string().email({
    message: "Please enter a valid email address.",
  }),

  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),

  userrole: z.string({
    required_error: "Please select a role.",
  })
});
const formUsersEditSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),

  email: z.string().email({
    message: "Please enter a valid email address.",
  }),

  role: z.string({
    required_error: "Please select a role.",
  })
});

const formAccountsSchema = z.object({
  id:z.string(),
  name: z.string().min(1, "Customer name is required"),
  industry: z.string().optional(),
  website: z.string().optional(),
  updated_at: z.string().optional(),
  Zone: z.string().optional(),
  Rating: z.string().optional(),
  ContPerson: z.string().optional(),
  Address1: z.string().optional(),
  Address2: z.string().optional(),
  City: z.string().optional(),
  Zip: z.string().optional(),
  State: z.string().optional(),
  Country: z.string().optional(),
  phone: z.string().min(10, "10-digit number").optional(),
  waphone: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  JoiningDate: z.coerce.date().optional(),
  designation_name: z.string().optional(),
  BusinessNature: z.string().optional(),
  StatusID: z.string().optional(),
  DesignationID: z.string().optional(),
  SourceID: z.string().optional(),
});



export function CrmContactModal() {
  const [open, setOpen] = useState(false)
  const [boxopen, setboxopen] = useState(false)
  const [showcompany,setshowcompany] = useState([])
  const [search,setsearch] = useState<string>();
  const submitData = async (data: any) => {
    const token = await fetch('/api/session').then((res: any) => res?.token).catch((e) => console.error(e))

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/contacts/insert`, {
      method: "POST",
      credentials:"include",
      headers: {
        "Content-Type": "application/json",
        'Cookie': token
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to create user")
    }
        window.location.reload();    

    }

  const form = useForm<z.infer<typeof formContactSchema>>({
    resolver: zodResolver(formContactSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      account_id: "",
    },
  })

  function onSubmit(values: z.infer<typeof formContactSchema>) {
    console.log(values)
    setOpen(false)
    submitData(values)
    form.reset()
  }
  
useEffect(()=>{
    
    const fetchData = async()=>{
     const res = await fetch('/api/session');
      const data = await res.json(); // Parse JSON body
      const token = data?.token;

      const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/accounts/list`,{
        method:"GET",
        credentials:'include',
        headers:{
          "Content-type":"applications/json",
          Cookie :token
        }
      })
      
      if (!result.ok) {
        throw new Error('Failed to fetch roles')
      }
      
      const company = await result.json()
      setshowcompany(company.message)

    }
    fetchData();
  },[])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 cursor-pointer">
          <UserPlus className="h-4 w-4" />
          Add Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px] max-h-[90vh] flex flex-col p-0 overflow-y-scroll ">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl">Create New Contact</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new contact.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="grid gap-6 pb-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone*</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="6755469556" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

         <FormField
          control={form.control}
          name="account_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {showcompany.length>0?showcompany.map((out:any,idx:number)=>{
                    return(
                      <SelectItem key={out.srcid} value={out.id} className="hover:bg-gray-200 cursor-pointer">{out.name}</SelectItem>
                    )
                  }):"No Companies."}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />


              </div>
            </ScrollArea>
            <DialogFooter className="px-6 py-4 border-t mt-auto">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Contact</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
export function CrmContactEditModal({data}:any) {
  const [open, setOpen] = useState(false)
  const [showcompany,setshowcompany] = useState([])
  const [companyname,setcompanyname] = useState();
   const submitData = async (data: any) => {
    const token = await fetch('/api/session').then((res:any)=>{return res?.token}).catch((e)=>console.error(e))
    console.log(data)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/contacts/`, {
      method: "PUT",
      credentials:"include",
      headers: {
        "Content-Type": "application/json",
        'Cookie': token
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to create user")
    }
    return response.json()
  }
  const form = useForm<z.infer<typeof formContactEditSchema>>({
    resolver: zodResolver(formContactEditSchema),
    defaultValues: {
      first_name: data[0]?.original?.first_name,
      last_name: data[0]?.original?.last_name,
      email: data[0]?.original?.email,
      phone: data[0]?.original?.phone,
      account_id:companyname
    },
  })

  function onSubmit(values: z.infer<typeof formContactEditSchema>) {
    const ndata = {...values,"id":data[0]?.original?.id}
    // console.log(values)
    setOpen(false)
    submitData(ndata)
    form.reset()
  }
  useEffect(()=>{
    
    const fetchData = async()=>{
     const res = await fetch('/api/session');
      const data = await res.json(); // Parse JSON body
      const token = data?.token;

      const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/accounts/list`,{
        method:"GET",
        credentials:'include',
        headers:{
          "Content-type":"applications/json",
          Cookie :token
        }
      })
      
      if (!result.ok) {
        throw new Error('Failed to fetch roles')
      }
      
      const company = await result.json()
      setshowcompany(company.message)

    }
    const fetchCompany = async(id:string)=>{
     const res = await fetch('/api/session');
      const data = await res.json(); // Parse JSON body
      const token = data?.token;

      const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/accounts/${id}`,{
        method:"GET",
        credentials:'include',
        headers:{
          "Content-type":"applications/json",
          Cookie :token
        }
      })
      
      if (!result.ok) {
        throw new Error('Failed to fetch roles')
      }
      
      const company = await result.json()
      setcompanyname(company?.message?.id)
      console.log(company.message.id)

    }
    fetchCompany(data[0]?.original?.account_id);
    fetchData();
    form.reset({
    first_name: data[0]?.original?.first_name,
    last_name: data[0]?.original?.last_name,
    email: data[0]?.original?.email,
    phone: data[0]?.original?.phone,
    account_id: companyname
  });
  },[companyname,data,form])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
       <button className="cursor-pointer hover:underline text-emerald-600">Edit</button>

      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px] max-h-[90vh] flex flex-col p-0 overflow-y-scroll">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl">Edit Contact</DialogTitle>
            <DialogDescription>
            Update the contact information in your CRM system. Modify the details below as needed.
            </DialogDescription>
        </DialogHeader>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
                <ScrollArea className="flex-1 px-6 py-4 ">
                  <div className="grid gap-6 pb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name*</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name*</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email*</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                     <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number*</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Select defaultValue={field.value.substring(0,3)} onValueChange={(value) => field.onChange(value + field.value.replace(/^\+\d+/, ''))}>
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="+91"><Flag code='IN' height="25px" width="25px"/> +91 India</SelectItem>
                                    <SelectItem value="+1"><Flag code='US' height="25px" width="25px"/> +1 USA</SelectItem>
                                    <SelectItem value="+86"><Flag code='CN' height="25px" width="25px"/> +86 China</SelectItem>
                                    <SelectItem value="+971"><Flag code='AE' height="25px" width="25px"/> +971 UAE</SelectItem>
                                    <SelectItem value="+65"><Flag code='SG' height="25px" width="25px"/> +65 Singapore</SelectItem>
                                    <SelectItem value="+44"><Flag code='GB' height="25px" width="25px"/> +44 UK</SelectItem>
                                    <SelectItem value="+81"><Flag code='JP' height="25px" width="25px"/> +81 Japan</SelectItem>
                                    <SelectItem value="+82"><Flag code='KR' height="25px" width="25px"/> +82 South Korea</SelectItem>
                                    <SelectItem value="+49"><Flag code='DE' height="25px" width="25px"/> +49 Germany</SelectItem>
                                    <SelectItem value="+61"><Flag code='AU' height="25px" width="25px"/> +61 Australia</SelectItem>
                                    <SelectItem value="+966"><Flag code='SA'height="25px" width="25px"/> +966 Saudi Arabia</SelectItem>
                                    <SelectItem value="+84"><Flag code='VN' height="25px" width="25px"/> +84 Vietnam</SelectItem>
                                    <SelectItem value="+62"><Flag code='ID' height="25px" width="25px"/> +62 Indonesia</SelectItem>
                                    <SelectItem value="+31"><Flag code='NL' height="25px" width="25px"/> +31 Netherlands</SelectItem>
                                    <SelectItem value="+33"><Flag code='FR' height="25px" width="25px"/> +33 France</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input placeholder="(555) 000-0000" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />


                 

                       <FormField
          control={form.control}
          name="account_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {showcompany.length>0?showcompany.map((out:any,idx:number)=>{
                    return(
                      <SelectItem key={out.srcid} value={out.id} className="hover:bg-gray-200 cursor-pointer">{out.name}</SelectItem>
                    )
                  }):"No Companies."}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
                     

                    

                   
                  </div>
                </ScrollArea>

            <DialogFooter className="px-6 py-4 border-t mt-auto ">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Contact</Button>
            </DialogFooter>
          </form>
        </Form>
       
      </DialogContent>
    </Dialog>
  )
}
export function CrmUsersEditModal({data}:any) {
  const [open, setOpen] = useState(false)
  const [roles,setroles] = useState([])
  const submitData = async (data: any) => {
    const token = await fetch('/api/session').then((res:any)=>{return res?.token}).catch((e)=>console.error(e));
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`, {
      method: "PUT",
      credentials:"include",
      headers: {
        "Content-Type": "application/json",
        'Cookie': token
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to create user")
    }
    window.location.reload();
    return response.json()

  }
  const form = useForm<z.infer<typeof formUsersEditSchema>>({
    resolver: zodResolver(formUsersEditSchema),
    defaultValues: {
      username:data[0]?.original.username,
      email: data[0]?.original.email,
      role: data[0]?.original.role,
    },
  })

  function onSubmit(values: z.infer<typeof formUsersEditSchema>) {
    console.log(values)
    setOpen(false)
    const ndata = {...values,"id":data[0]?.original?.id};
    submitData(ndata)
    form.reset()
  }
  useEffect(()=>{
    const fetchData = async()=>{
     const res = await fetch('/api/session');
      const data = await res.json(); // Parse JSON body
      const token = data?.token;

      const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/roles`,{
        method:"GET",
        credentials:'include',
        headers:{
          "Content-type":"applications/json",
          Cookie :token
        }
      })
      
      if (!result.ok) {
        throw new Error('Failed to fetch roles')
      }
      
      const roles = await result.json()
      setroles(roles.message)

    }
    fetchData();
  },[])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <button className="cursor-pointer hover:underline text-emerald-600">Edit</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px] max-h-[90vh] flex flex-col p-0 overflow-y-scroll">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl">Edit User Details</DialogTitle>
            <DialogDescription>
            Update user details in your CRM system. Modify the information below as needed.
            </DialogDescription>
        </DialogHeader>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
                <ScrollArea className="flex-1 px-6 py-4 ">
                  <div className="grid gap-6 pb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>UserName*</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email*</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@mail.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                   

                   

                   

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="cursor-pointer">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles.length>0?roles.map((out:any,idx:number)=>{
                              return(
                                <SelectItem key={idx} value={out.value} className="hover:bg-gray-200 cursor-pointer focus:bg-gray-200 ">{out.value}</SelectItem>
                              )
                            }):null}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                    
                    </div>

                   

                    
                  </div>
                </ScrollArea>

            <DialogFooter className="px-6 py-4 border-t mt-auto ">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Contact</Button>
            </DialogFooter>
          </form>
        </Form>
       
      </DialogContent>
    </Dialog>
  )
}
export function CrmAccountsEditModal({data}:any) {
  const [open, setOpen] = useState(false)
  const [show,setShow] = useState(true)
  const [showroles,setshowroles] = useState([])

  const form = useForm<z.infer<typeof formAccountsSchema>>({
    resolver: zodResolver(formAccountsSchema),
    defaultValues: {
      id:data[0]?.original.id,
      name: data[0]?.original.name,
      industry: data[0]?.original.industry,
      website: data[0]?.original.website,
      updated_at: data[0]?.original.updated_at,
      Zone: data[0]?.original.Zone,
      Rating: data[0]?.original.Rating,
      ContPerson: data[0]?.original.ContPerson,
      Address1: data[0]?.original.Address1,
      Address2: data[0]?.original.Address2,
      City: data[0]?.original.City,
      Zip: data[0]?.original.Zip,
      State: data[0]?.original.State,
      Country: data[0]?.original.Country,
      phone: data[0]?.original.phone,
      waphone: data[0]?.original.waphone,
      email: data[0]?.original.email,
      designation_name: data[0]?.original.designation_name,
      BusinessNature: data[0]?.original.BusinessNature,
      JoiningDate: new Date(),
      SourceID: data[0]?.original.SourceID,
      DesignationID: data[0]?.original.DesignationID, 
      StatusID: data[0]?.original.StatusID
    }
  })

  function onSubmit(values: z.infer<typeof formAccountsSchema>) {
    console.log(values)
    setOpen(false)
       const fetchData = async()=>{
     const res = await fetch('/api/session');
      const data = await res.json(); // Parse JSON body
      const token = data?.token;


      const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/accounts/`,{
        method:"PUT",
        credentials:'include',
        headers:{
          "Content-Type": "application/json",
          Cookie: token
        },
        body: JSON.stringify(values)
      })
      
      if (!result.ok) {
        throw new Error('Failed to insert Account.')
      }
      
      const roles = await result.json()
      console.log(roles);
      setshowroles(roles.message)

    }
    fetchData();
    form.reset()
    window.location.reload();
  }
  useEffect(()=>{
    
    const fetchData = async()=>{
     const res = await fetch('/api/session');
      const datas = await res.json(); // Parse JSON body
      const token = datas?.token;

      const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/accounts/idDetails`,{
        method:"GET",
        credentials:'include',
        headers:{
          "Content-type":"applications/json",
          Cookie :token
        }
      })
      
      if (!result.ok) {
        throw new Error('Failed to fetch ids')
      }
      
      const roles = await result.json()
      console.log(roles);
      setshowroles(roles.message[0])

    }
    fetchData();
    console.log(data[0]?.original?.id);
  },[])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
              <button className="cursor-pointer hover:underline text-emerald-600">Edit</button>

      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px] max-h-[90vh] flex flex-col p-0 overflow-y-scroll">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl">Edit Contact</DialogTitle>
          <DialogDescription>
            Edit account to your CRM system. Fill out the form below with the account details.
          </DialogDescription>
        </DialogHeader>
        <Separator />
      <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
    <ScrollArea className="flex-1 px-6 py-4">
      <div className="grid gap-6 pb-4">

        <FormField name="id" control={form.control} render={({ field }) => (
  <FormItem><FormLabel>ID</FormLabel>
  <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
)} />

        <FormField name="name" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Company Name</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField name="industry" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Industry</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="email" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Email</FormLabel>
          <FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="phone" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Phone</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="waphone" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Whatsapp Phone</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="BusinessNature" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Business Nature</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="Address1" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Address</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="Address2" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Address 2</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="City" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>City</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="State" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>State</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="Country" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Country</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="Zip" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Zip Code</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />


        <FormField name="Zone" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Zone</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="Rating" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Rating</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />


        <FormField name="website" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Website</FormLabel>
          <FormControl><Input  {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="JoiningDate" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Joining Date</FormLabel>
          <FormControl>
            <Input 
              type="date" 
              value={field.value?.toISOString().split('T')[0]} 
              onChange={(e) => field.onChange(new Date(e.target.value))}
            />
          </FormControl>
          <FormMessage />
          </FormItem>
        )} />

<FormField name="ContPerson" control={form.control} render={({ field }) => (
  <FormItem><FormLabel>Contact Person</FormLabel>
  <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
)} />


<FormField
control={form.control}
name="DesignationID"
render={({ field }) => (
  <FormItem>
    <FormLabel>Designation*</FormLabel>
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="Select Designation" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {showroles.length>0?showroles.map((out:any)=> (
          <SelectItem key={out.degid} value={out.degid} className={`cursor-pointer hover:bg-gray-200`}>{out.degname}</SelectItem>
        )):null}
      </SelectContent>
    </Select>
    <FormMessage />
  </FormItem>
)}
/>
        <FormField
          control={form.control}
          name="SourceID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {showroles.length>0?showroles.map((out:any)=> (
                    <SelectItem key={out.srcid} value={out.srcid} className={`cursor-pointer hover:bg-gray-200`}>{out.srctype}</SelectItem>
                  )):null}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="StatusID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {showroles.length>0?showroles.map((out:any)=> (
                    <SelectItem key={out.statid} value={out.statid} className={`cursor-pointer hover:bg-gray-200`}>{out.statustype}</SelectItem>
                  )):null}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

      </div>
    </ScrollArea>

    <DialogFooter className="px-6 py-4 border-t mt-auto">
      <Button variant="outline" type="button" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button type="submit">Save</Button>
    </DialogFooter>
  </form>
</Form>


       
      </DialogContent>
    </Dialog>
  )
}
export function CrmTaskModal({ data }: any) {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(true);
  const [showroles, setshowroles] = useState([]);
  const [showcompany,setshowcompany] = useState([]);

  const form = useForm({
    resolver: zodResolver(formTaskSchema),
    defaultValues: {
      subject: data[0]?.original.subject,
      body: data[0]?.original.body,  
      status: data[0]?.original.status,
      due_date: data[0]?.original.due_date,
      contact_id: data[0]?.original.id,
      assigned_user_id : ''
    }
  });

  function onSubmit(values: any) {
    console.log(values);
    setOpen(false);

    const fetchData = async () => {
      const res = await fetch('/api/session');
      const data = await res.json();
      const token = data?.token;
      console.log('Before Sending:',values)
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/tasks/insert`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          Cookie: token
        },
        body: JSON.stringify(values)
      });

      if (!result.ok) {
        throw new Error('Failed to insert Account.');
      }

      const roles = await result.json();
      console.log(roles);
      setshowroles(roles.message);
    };

    fetchData();
    form.reset();
    toast("✅ Task has been created.");
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/session');
      const data = await res.json();
      const token = data?.token;

      const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/`, {
        method: "GET",
        credentials: 'include',
        headers: {
          "Content-type": "applications/json",
          Cookie: token
        }
      });

      if (!result.ok) {
        throw new Error('Failed to fetch ids');
      }
       const resultn = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/accounts/idDetails`,{
        method:"GET",
        credentials:'include',
        headers:{
          "Content-type":"applications/json",
          Cookie :token
        }
      })
      if (!resultn.ok) {
        throw new Error('Failed to fetch roles')
      }
      
      const company = await resultn.json()
      console.log(company)
      setshowcompany(company.message[0])

      const roles = await result.json();
      console.log(roles)
      setshowroles(roles.message[0]);
    };
    fetchData();

  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="cursor-pointer hover:underline w-fit whitespace-nowrap  text-emerald-600 flex flex-row gap-1 items-center">
          <Plus size={15} /> Create a Task
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px] max-h-[90vh] flex flex-col p-0 overflow-y-scroll">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl">Create a task</DialogTitle>
          <DialogDescription>
            Create a task in your CRM system. Fill out the form below with the task details.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="grid gap-6 pb-4">
                <FormField name="subject" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Subject</FormLabel>
                  <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="body" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Body</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status*</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {showcompany.length>0?showcompany.map((out:any)=> (
                          <SelectItem key={out.statid} value={out.statid} className={`cursor-pointer hover:bg-gray-200`}>{out.statustype}</SelectItem>
                        )):null}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
                />
                <FormField name="due_date" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value?.split("T")[0] || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
                )} />
                <FormField
                control={form.control}
                name="assigned_user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign To*</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select User" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {showroles.length>0?showroles.map((out:any)=> (
                          <SelectItem key={out.id} value={out.id} className={`cursor-pointer hover:bg-gray-200`}>{out.username}</SelectItem>
                        )):null}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
                />
              </div>
            </ScrollArea>
            <DialogFooter className="px-6 py-4 border-t mt-auto">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
export function CrmTaskEditModal({ data,updateparent }: any) {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(true);
  const [showroles, setshowroles] = useState([]);
  const [refresh,setrefresh] = useState(false);
  const [showcompany,setshowcompany] = useState([]);

  const form = useForm({
    resolver: zodResolver(formTaskEditSchema),
    defaultValues: {
      id:data[0]?.original.id,
      subject: data[0]?.original.subject,
      body: data[0]?.original.body,  
      status: data[0]?.original.status,
      due_date: data[0]?.original.due_date,
      assigned_user_id : data[0]?.original.assigned_user_id
    }
  });

  function onSubmit(values: any) {
    console.log(values);
    setOpen(false);

    const fetchData = async () => {
      const res = await fetch('/api/session');
      const data = await res.json();
      const token = data?.token;
      console.log('Before Sending:',values)
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/tasks/`, {
        method: "PUT",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          Cookie: token
        },
        body: JSON.stringify(values)
      });

      if (!result.ok) {
        toast("🔴 Error updating task.");
        throw new Error('Failed to update Task.');

      }
      toast("✅ Task has been updated.");


      const roles = await result.json();
      console.log(roles);
      setshowroles(roles.message);
    };

    fetchData();
    form.reset();
    updateparent();
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/session');
      const datas = await res.json();
      const token = datas?.token;

      const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/`, {
        method: "GET",
        credentials: 'include',
        headers: {
          "Content-type": "applications/json",
          Cookie: token
        }
      });

      if (!result.ok) {
        throw new Error('Failed to fetch ids');
      }
       const resultn = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/accounts/idDetails`,{
        method:"GET",
        credentials:'include',
        headers:{
          "Content-type":"applications/json",
          Cookie :token
        }
      })
      if (!resultn.ok) {
        throw new Error('Failed to fetch roles')
      }
      
      const company = await resultn.json()
      console.log(company)
      setshowcompany(company.message[0])

      const roles = await result.json();
      console.log(roles)
      setshowroles(roles.message[0]);
      console.log('Data',data[0]?.original);
    };

    fetchData();

  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="cursor-pointer hover:underline w-fit whitespace-nowrap  text-emerald-600 flex flex-row gap-1 items-center">
          Edit
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px] max-h-[90vh] flex flex-col p-0 overflow-y-scroll">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl">Edit a task</DialogTitle>
          <DialogDescription>
            Edit a task in your CRM system. Fill out the form below with the task details.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="grid gap-6 pb-4">
                <FormField name="subject" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Subject</FormLabel>
                  <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="body" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Body</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {showcompany.length>0?showcompany.map((out:any)=> (
                          <SelectItem key={out.statid} value={out.statid} className={`cursor-pointer hover:bg-gray-200`}>{out.statustype}</SelectItem>
                        )):null}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
                />
                <FormField name="due_date" control={form.control} render={({ field }) => (
                  <FormItem><FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value?.split("T")[0] || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
                )} />
                <FormField
                control={form.control}
                name="assigned_user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign To*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select User" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {showroles.length>0?showroles.map((out:any)=> (
                          <SelectItem key={out.id} value={out.id} className={`cursor-pointer hover:bg-gray-200`}>{out.username}</SelectItem>
                        )):null}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
                />
              </div>
            </ScrollArea>
            <DialogFooter className="px-6 py-4 border-t mt-auto">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function Addfield(){
  return(
     <div className="flex flex-col gap-2 p-4 border rounded-md">
                                          <div className="flex gap-2">
                                            <input 
                                              type="text" 
                                              placeholder="Field name" 
                                              className="px-3 py-2 border rounded-md flex-1"
                                            />
                                            <select className="px-3 py-2 border rounded-md">
                                              <option value="string">String</option>
                                              <option value="number">Number</option>
                                              <option value="boolean">Boolean</option>
                                              <option value="date">Date</option>
                                            </select>
                                          </div>
                                           <Button >Add Field</Button>
                                        </div>
                                        
  )
}
export function CrmUsersModal() {
  const [open, setOpen] = useState(false)
  const [show,setShow] = useState(true)
  const [showroles,setshowroles] = useState([])
  const submitData = async (data: any) => {
    const token = await fetch('/api/session').then((res:any)=>{return res?.token}).catch((e)=>console.error(e))
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/insert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Cookie': token
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error("Failed to create user")
    }
    return response.json()
  }
  const form = useForm<z.infer<typeof formUsersSchema>>({
    resolver: zodResolver(formUsersSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      userrole: '',
  }})

  function onSubmit(values: z.infer<typeof formUsersSchema>) {
    console.log(values)
    setOpen(false)
       const fetchData = async()=>{
     const res = await fetch('/api/session');
      const data = await res.json(); // Parse JSON body
      const token = data?.token;

      const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/insert`,{
        method:"POST",
        credentials:'include',
        headers:{
          "Content-Type": "application/json",
          Cookie: token
        },
        body: JSON.stringify(values)
      })
      
      if (!result.ok) {
        throw new Error('Failed to insert user.')
      }
      
      const roles = await result.json()
      console.log(values);
      setshowroles(roles.message)

    }
    fetchData();
    form.reset()
    window.location.reload();
  }
  useEffect(()=>{
    
    const fetchData = async()=>{
     const res = await fetch('/api/session');
      const data = await res.json(); // Parse JSON body
      const token = data?.token;

      const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/roles`,{
        method:"GET",
        credentials:'include',
        headers:{
          "Content-type":"applications/json",
          Cookie :token
        }
      })
      
      if (!result.ok) {
        throw new Error('Failed to fetch roles')
      }
      
      const roles = await result.json()
      console.log(roles);
      setshowroles(roles.message)

    }
    fetchData();
  },[])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 cursor-pointer">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px] max-h-[90vh] flex flex-col p-0 overflow-y-scroll">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl">Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to your CRM system. Fill out the form below with the contact details.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
    <ScrollArea className="flex-1 px-6 py-4">
      <div className="grid gap-6 pb-4">

        {/* Username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username*</FormLabel>
              <FormControl>
                <Input placeholder="e.g. johndoe123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Hash (can be replaced with a password field on UI) */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password*</FormLabel>
              <FormControl>
                <div className="flex flex-row justify-between">
                {show?<Input type="password" placeholder="password" {...field} />:
                <Input type="text" placeholder="password" {...field} />}
                <button 
                className="px-5 cursor-pointer"
                onClick={(e)=>{
                  e.preventDefault()
                  setShow(!show)

                }}>{!show?<Eye/>:<EyeClosed/>}</button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role */}
        <FormField
          control={form.control}
          name="userrole"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {showroles.length>0?showroles.map((out:any,idx:number)=>{
                    return(
                      <SelectItem key={idx} value={out.value} className="hover:bg-gray-200 cursor-pointer focus:bg-gray-200 ">{out.value}</SelectItem>
                    )
                  }):null}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

      

     
      </div>
    </ScrollArea>

    <DialogFooter className="px-6 py-4 border-t mt-auto">
      <Button variant="outline" type="button" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button type="submit">Save User</Button>
    </DialogFooter>
  </form>
</Form>

       
      </DialogContent>
    </Dialog>
  )
}

export function CrmAccountsModal() {
  const [open, setOpen] = useState(false)
  const [show,setShow] = useState(true)
  const [showroles,setshowroles] = useState([])

  const form = useForm<z.infer<typeof formAccountsSchema>>({
    resolver: zodResolver(formAccountsSchema),
   defaultValues: {

  name: '',
  industry: '',
  website: '',
  updated_at: '',
  Zone: '',
  Rating: '',
  ContPerson: '',
  Address1: '',
  Address2: '',
  City: '',
  Zip: '',
  State: '',
  Country: '',
  phone: '',
  waphone: '',
  email: '',
  designation_name: '',
  BusinessNature: '',
  JoiningDate: new Date(),
  // Existing Select Box ID fields
  SourceID: '',
  DesignationID: '',
  StatusID: '',
}})

  function onSubmit(values: z.infer<typeof formAccountsSchema>) {
    console.log(values)
    setOpen(false)
       const fetchData = async()=>{
     const res = await fetch('/api/session');
      const data = await res.json(); // Parse JSON body
      const token = data?.token;

      const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/accounts/insert`,{
        method:"POST",
        credentials:'include',
        headers:{
          "Content-Type": "application/json",
          Cookie: token
        },
        body: JSON.stringify(values)
      })
      
      if (!result.ok) {
        throw new Error('Failed to insert Account.')
      }
      
      const roles = await result.json()
      console.log(roles);
      setshowroles(roles.message)

    }
    fetchData();
    // console.log(values);
    form.reset()
    window.location.reload();
  }
  useEffect(()=>{
    
    const fetchData = async()=>{
     const res = await fetch('/api/session');
      const data = await res.json(); // Parse JSON body
      const token = data?.token;

      const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/accounts/idDetails`,{
        method:"GET",
        credentials:'include',
        headers:{
          "Content-type":"applications/json",
          Cookie :token
        }
      })
      
      if (!result.ok) {
        throw new Error('Failed to fetch ids')
      }
      
      const roles = await result.json()
      console.log(roles);
      setshowroles(roles.message[0])

    }
    fetchData();
  },[])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 cursor-pointer">
          <UserPlus className="h-4 w-4" />
          Add Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px] max-h-[90vh] flex flex-col p-0 overflow-y-scroll">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl">Create New Account</DialogTitle>
          <DialogDescription>
            Add a new account to your CRM system. Fill out the form below with the account details.
          </DialogDescription>
        </DialogHeader>
        <Separator />
      <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
    <ScrollArea className="flex-1 px-6 py-4">
      <div className="grid gap-6 pb-4">

        
        <FormField name="name" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Company Name</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField name="industry" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Industry</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="email" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Email</FormLabel>
          <FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="phone" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Phone</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="waphone" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Whatsapp Phone</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="BusinessNature" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Business Nature</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="Address1" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Address</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="Address2" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Address 2</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="City" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>City</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="State" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>State</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="Country" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Country</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="Zip" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Zip Code</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="Zone" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Zone</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="Rating" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Rating</FormLabel>
          <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />


        <FormField name="website" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Website</FormLabel>
          <FormControl><Input  {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField name="JoiningDate" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Joining Date</FormLabel>
          <FormControl>
            <Input 
              type="date" 
              value={field.value?.toISOString().split('T')[0]} 
              onChange={(e) => {field.onChange(new Date(e.target.value))
                console.log(new Date(e.target.value))
              }}
            />
          </FormControl>
          <FormMessage />
          </FormItem>
        )} />

<FormField name="ContPerson" control={form.control} render={({ field }) => (
  <FormItem><FormLabel>Contact Person</FormLabel>
  <FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
)} />


<FormField
control={form.control}
name="DesignationID"
render={({ field }) => (
  <FormItem>
    <FormLabel>Designation*</FormLabel>
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="Select Designation" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {showroles.length>0?showroles.map((out:any)=> (
          <SelectItem key={out.degid} value={out.degid} className={`cursor-pointer hover:bg-gray-200`}>{out.degname}</SelectItem>
        )):null}
      </SelectContent>
    </Select>
    <FormMessage />
  </FormItem>
)}
/>
        <FormField
          control={form.control}
          name="SourceID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {showroles.length>0?showroles.map((out:any)=> (
                    <SelectItem key={out.srcid} value={out.srcid} className={`cursor-pointer hover:bg-gray-200`}>{out.srctype}</SelectItem>
                  )):null}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="StatusID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {showroles.length>0?showroles.map((out:any)=> (
                    <SelectItem key={out.statid} value={out.statid} className={`cursor-pointer hover:bg-gray-200`}>{out.statustype}</SelectItem>
                  )):null}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

      </div>
    </ScrollArea>

    <DialogFooter className="px-6 py-4 border-t mt-auto">
      <Button variant="outline" type="button" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button type="submit">Save</Button>
    </DialogFooter>
  </form>
</Form>


       
      </DialogContent>
    </Dialog>
  )
}
