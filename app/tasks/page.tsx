'use client'
import { Header } from "@/components/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { columns, Task } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Columns3, FilterIcon, Loader2, Pen, SortDesc, X } from "lucide-react";
import { Suspense, use, useEffect, useState } from "react";
import { CrmUsersModal } from "@/components/forms";

export default  function Tasks() {
      const [dataone, setdataone] = useState<Task[]>([])
      const [datatwo, setdatatwo] = useState<Task[]>([])
      const [loading, setloading] = useState<boolean>(false)
      const [typing, settyping] = useState<string>('')
      const [view,setview] = useState<number>(0)
      const fetchalltasks = async () => {
          
          const token = await fetch('/api/session').then((res:any)=>{return res?.token}).catch((e)=>console.error(e))
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/tasks/all`,{
            credentials:'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': token
            }
          }).then(async(res)=>{
            const result = await res.json()
            setdatatwo(result?.message[0])
            console.log("TaskTwo",result?.message[0])
            setloading(true)
        }).catch((e)=>{console.error(e)})
        }

        const fetchmytasks = async () => {
          
          const token = await fetch('/api/session').then((res:any)=>{return res?.token}).catch((e)=>console.error(e))
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/tasks/`,{
            credentials:'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': token
            }
          }).then(async(res)=>{
            const result = await res.json()
            setdataone(result?.message[0])
            console.log("TaskOne",result?.message[0])
            setloading(true)
        }).catch((e)=>{console.error(e)})
        }
      useEffect(() => {
        const fetchData = async () => {
          
          const token = await fetch('/api/session').then((res:any)=>{return res?.token}).catch((e)=>console.error(e))
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/tasks/`,{
            credentials:'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': token
            }
          }).then(async(res)=>{
            const result = await res.json()
            setdataone(result?.message[0])
            console.log("TaskOne",result?.message[0])
            setloading(true)
        }).catch((e)=>{console.error(e)})
        }
        fetchData()
        
      },[]);
    return(
        <>
              <div className="flex-1 flex flex-col overflow-scroll bg-transparent" style={{scrollbarWidth:"none"}}>
                <Header/>
                <main className="flex flex-col overflow-y-auto p-6">
                    <div className="text-2xl flex flex-row items-center gap-5 font-bold" style={{fontFamily:"var(--font-noto-sans)"}}>
                    <Pen color="green"/>Tasks   
                     
                    </div>
                    <Card className="w-full mx-auto overflow-hidden bg-transparent shadow-none border-0">
                     <div className="flex flex-row gap-2"> 
                    <Button variant={view==0?"default":"outline"} className="rounded-none" onClick={()=>{
                      fetchmytasks();
                      setview(0)}}>My Tasks</Button>
                    <Button variant={view==1?"default":"outline"} className="rounded-none" onClick={()=>{
                      fetchalltasks();
                      setview(1);
                      }}>All Tasks</Button>
                    </div>
                     {loading && view==0 && <DataTable columns={columns} data={dataone}/>}
                     {loading && view==1 && <DataTable columns={columns} data={datatwo}/>}
                     {!loading && <div className="flex flex-row items-center gap-2 justify-center h-64">
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span className="text-gray-500">Loading...</span>
                      </div>}
                     </Card>
                 </main>
                 
              </div>
        </>
    )
}

