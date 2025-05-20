'use client'
import { Header } from "@/components/sidebar";
import type { Users } from "./columns"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Columns3, FilterIcon, Loader2, SortDesc, X } from "lucide-react";
import { Suspense, use, useEffect, useState } from "react";
import { CrmUsersModal } from "@/components/forms";

export default  function Users() {
      const [data, setdata] = useState<Users[]>([])
      const [loading, setloading] = useState<boolean>(false)
      const [typing, settyping] = useState<string>('')
      useEffect(() => {
        const fetchData = async () => {
          
          const token = await fetch('/api/session').then((res:any)=>{return res?.token}).catch((e)=>console.error(e))
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/`,{
            credentials:'include',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': token
            }
          }).then(async(res)=>{
            const result = await res.json()
            setdata(result?.message[0])
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
                    <div>
                        <div className="flex flex-col sm:flex-row  justify-between items-start sm:items-center gap-4 mb-4">
                            <div className="flex flex-row items-center gap-2 w-full sm:w-1/4  rounded-md bg-transparent px-2">
                                <input
                                    type="input"
                                    placeholder="Search users..."
                                    value={typing}
                                    className="w-full px-3 py-2 rounded-md border-input bg-transparent border-b focus:outline-none focus:border-emerald-500 focus:ring-0"
                                    onChange={(e)=>{settyping(e.target.value)}}
                                />
                                {typing.length!=0 && <div>
                                    <button className="h-8 w-5 rounded-md cursor-pointer flex justify-center items-center bg-transparent"
                                    onClick={() => settyping('')}>
                                        <X className="h-4 w-4"/>
                                    </button>
                                </div>}
                                <Button variant="outline">
                                    Filter
                                    <FilterIcon className="h-4 w-4 ml-2"/>
                                </Button>
                               
                            </div>
                            <div className="flex gap-2">
                                
                                <Button variant="outline">
                                    Sort
                                    <SortDesc className="h-4 w-4 ml-2"/>
                                </Button>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">
                                            Columns
                                            <Columns3 className="h-4 w-4 ml-2"/>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Manage Columns</DialogTitle>
                                            <DialogDescription>
                                                Select which columns you want to display in the table.
                                            </DialogDescription>
                                        </DialogHeader>
                                        {/* Add column selection content here */}
                                    </DialogContent>
                                </Dialog>
                                <CrmUsersModal/>
                            </div>
                            
                        </div>
                     
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

