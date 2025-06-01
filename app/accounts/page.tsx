'use client'
import { Header } from "@/components/sidebar";
import type { Account } from "./columns"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Columns3, Contact2Icon, ContactRound, FilterIcon, Loader2, SortDesc, X } from "lucide-react";
import { Suspense, use, useEffect, useState } from "react";
import { CrmUsersModal } from "@/components/forms";

export default  function Users() {
      const [data, setdata] = useState<Account[]>([])
      const [loading, setloading] = useState<boolean>(false)
      const [typing, settyping] = useState<string>('')
      useEffect(() => {
        const fetchData = async () => {
          
          const token = await fetch('/api/session').then((res:any)=>{return res?.token}).catch((e)=>console.error(e))
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/accounts/`,{
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
        fetchData()
      },[]);
    return(
        <>
              <div className="flex-1 flex flex-col overflow-scroll bg-transparent" style={{scrollbarWidth:"none"}}>
                <Header/>
                <main className="flex flex-col overflow-y-auto p-6 gap-5">
                    <div className="text-2xl flex flex-row items-center gap-3 font-bold" style={{fontFamily:"var(--font-noto-sans)"}}>
                    <ContactRound color="green"/>Contacts   
                     
                    </div>
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

