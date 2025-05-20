"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { UserPlus } from "lucide-react"
import Flag from 'react-world-flags'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  type: z.string({
    required_error: "Please select a contact type.",
  }),
  status: z.string({
    required_error: "Please select a status.",
  }),
  source: z.string().optional(),
  notes: z.string().optional(),
})

export function CrmContactModal() {
  const [open, setOpen] = useState(false)
   const submitData = async (data: any) => {
    const token = await fetch('/api/session').then((res:any)=>{return res?.token}).catch((e)=>console.error(e))
    const response = await fetch("/api/contacts/insert", {
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      type: "",
      status: "",
      source: "",
      notes: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    setOpen(false)
    submitData(values)
    form.reset()
  }

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
          <DialogTitle className="text-xl">Create New Contact</DialogTitle>
          <DialogDescription>
            Add a new contact to your CRM system. Fill out the form below with the contact details.
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
                        name="firstName"
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
                        name="lastName"
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
                              <Select defaultValue="+91" onValueChange={(value) => field.onChange(value + field.value.replace(/^\+\d+/, ''))}>
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


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <Input placeholder="Acme Inc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Marketing Manager" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Type*</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select contact type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="lead">Lead</SelectItem>
                                <SelectItem value="customer">Customer</SelectItem>
                                <SelectItem value="partner">Partner</SelectItem>
                                <SelectItem value="vendor">Vendor</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status*</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="source"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lead Source</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select lead source" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="website">Website</SelectItem>
                              <SelectItem value="referral">Referral</SelectItem>
                              <SelectItem value="social">Social Media</SelectItem>
                              <SelectItem value="email">Email Campaign</SelectItem>
                              <SelectItem value="event">Event</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Add any additional information about this contact..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
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
              <Button type="submit">Save Contact</Button>
            </DialogFooter>
          </form>
        </Form>
       
      </DialogContent>
    </Dialog>
  )
}

export function CrmUsersModal() {
  const [open, setOpen] = useState(false)
  const submitData = async (data: any) => {
    const token = await fetch('/api/session').then((res:any)=>{return res?.token}).catch((e)=>console.error(e))
    const response = await fetch("/api/users/insert", {
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      type: "",
      status: "",
      source: "",
      notes: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    setOpen(false)
    // submitData(values)
    form.reset()
  }

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
                <ScrollArea className="flex-1 px-6 py-4 ">
                  <div className="grid gap-6 pb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
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
                        name="lastName"
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
                              <Select defaultValue="+91" onValueChange={(value) => field.onChange(value + field.value.replace(/^\+\d+/, ''))}>
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <Input placeholder="Acme Inc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="jobTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Marketing Manager" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Type*</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select contact type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="lead">Lead</SelectItem>
                                <SelectItem value="customer">Customer</SelectItem>
                                <SelectItem value="partner">Partner</SelectItem>
                                <SelectItem value="vendor">Vendor</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status*</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="source"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lead Source</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select lead source" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="website">Website</SelectItem>
                              <SelectItem value="referral">Referral</SelectItem>
                              <SelectItem value="social">Social Media</SelectItem>
                              <SelectItem value="email">Email Campaign</SelectItem>
                              <SelectItem value="event">Event</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Add any additional information about this contact..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
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
              <Button type="submit">Save Contact</Button>
            </DialogFooter>
          </form>
        </Form>
       
      </DialogContent>
    </Dialog>
  )
}