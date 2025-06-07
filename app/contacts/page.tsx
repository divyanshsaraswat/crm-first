'use client'
import { Header } from "@/components/sidebar";
import { columns } from "./columns"
import type {Contacts}from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Columns3, FilterIcon, Loader2, PlusCircle, SortAsc, SortDesc, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"
import { Suspense, use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const FormSchema = z.object({
  items: z.array(z.string())
});
import { CrmContactModal } from "@/components/forms";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

export default  function Contacts() {
    const items = [

  {
    id: "first_name",
    label: "First Name",
  },
  {
    id: "last_name",
    label: "Last Name",
  },
  {
    id: "email",
    label: "Email",
  },
  {
    id: "company",
    label: "Company",
  },
  {
    id: "date_modified",
    label: "Date Modified",
  },
] as const
      const [data, setdata] = useState<Contacts[]>([])
      const [loading, setloading] = useState<boolean>(false)
      const [typing, settyping] = useState<string>('')
     useEffect(() => {
        const fetchData = async () => {
          
          const token = await fetch('/api/session').then((res:any)=>{return res?.token}).catch((e)=>console.error(e))
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/contacts/`,{
            credentials:'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': token
            }
          }).then(async(res)=>{
            const result = await res.json()
            setdata(result?.message[0])
            console.log(result?.message[0])
            setloading(true)
        }).catch((e)=>{console.error(e)})
        }
        // fetchData()
        
      },[]);
      const form = useForm<z.infer<typeof FormSchema>>({

    defaultValues: {
      items: ["recents", "home"],
    },
  })
    return(
        <>
              <div className="flex-1 flex flex-col overflow-scroll bg-transparent" style={{scrollbarWidth:"none"}}>

                <Header/>
                <main className="flex flex-col overflow-y-auto p-6">
                 
                    <div className="w-full mx-auto overflow-hidden bg-transparent">
                     {loading && <DataTable columns={columns} data={data}/>}
                     {!loading && <div className="flex flex-row items-center gap-2 justify-center h-64">
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span className="text-gray-500">Loading...</span>
                      </div>}
                     </div>
                 </main>
                 
              </div>
        </>
    )
}

