'use client'
import { Header } from "@/components/sidebar";
import { columns } from "./columns"
import type {Contacts}from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Columns3, FilterIcon, Loader2, PlusCircle, SortDesc, X } from "lucide-react";
import { Suspense, use, useEffect, useState } from "react";
import { CrmContactModal } from "@/components/forms";

export default  function Contacts() {
      const [data, setdata] = useState<Contacts[]>([])
      const [loading, setloading] = useState<boolean>(false)
      const [typing, settyping] = useState<string>('')
      useEffect(() => {
        async function getData(): Promise<Contacts[]> {
            const baseData: Contacts[] = [
                {
                    id: "728ed52f",
                    first_name: "John",
                    last_name: "Doe",
                    email: "john.doe@example.com",
                    phone: "+1-555-0123",
                    account_id: "ACC001",
                    contact_owner_id: "OWN001"
                },
                {
                    id: "489e1d42",
                    first_name: "Jane",
                    last_name: "Smith",
                    email: "jane.smith@example.com",
                    phone: "+1-555-0124",
                    account_id: "ACC002",
                    contact_owner_id: "OWN002"
                },
                {
                    id: "63d97823",
                    first_name: "Robert",
                    last_name: "Johnson",
                    email: "robert.j@example.com",
                    phone: "+1-555-0125",
                    account_id: "ACC003",
                    contact_owner_id: "OWN003"
                }
            ];
            
            return Array(25).fill(null).flatMap((_, index) =>
                baseData.map(item => ({
                    ...item,
                    id: `${item.id}-${index + 1}` // Add unique ids
                }))
            );
        }
        const fetchData = async () => {
          const res = await getData()
          setdata(res)
          setloading(true)
        }
        fetchData()
      },[]);
    return(
        <>
              <div className="flex-1 flex flex-col overflow-scroll bg-transparent" style={{scrollbarWidth:"none"}}>

                <Header/>
                <main className="flex flex-col overflow-y-auto p-6">
                    <div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <div className="flex flex-row items-center gap-2 w-full sm:w-auto  rounded-md bg-transparent px-2">
                                <input
                                    type="input"
                                    placeholder="Search contacts..."
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
                                <CrmContactModal/>
                            </div>
                            
                        </div>
                    </div>
                    <div className="w-full mx-auto overflow-hidden bg-transparent">
                     {loading && <DataTable columns={columns} data={data} />}
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

