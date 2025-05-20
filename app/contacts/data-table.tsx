"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { Button } from "@/components/ui/button" // For pagination buttons
import { ChevronDown, ChevronLeft, ChevronRight,PencilIcon,BoxSelect,EllipsisVertical } from "lucide-react" // Optional icons

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
    const [select, setselect] = useState<string[]>([])

  const table = useReactTable({
    data,
    columns,
    
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Add this line
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  })


  const getAllId = () => {
    const allIds = table.getRowModel().rows.map((row) => row.getValue('id')) as string[];
    if (select.length === 0) {
      setselect(allIds);
    } else {
      setselect([]);
    }
  }
  const deleteId = (id:string) => {
    
    const fetchData = async () => {
      const token = await fetch('/api/session').then((res:any)=>{return res?.token}).catch((e)=>console.error(e))
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': token
        }
      });
      if (response.ok) {
        console.log('Data deleted successfully');
      } else {
        console.error('Error deleting data');
      }
    }
    fetchData();
    setselect([]);
  }
  const exportdata = (data:string[])=>{
    const fetchData = async () => {
      const token = await fetch('/api/session').then((res:any)=>{return res?.token}).catch((e)=>console.error(e))
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/contacts/export`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': token
        },
        body: JSON.stringify({ "records": select }),
      });
      if (response.ok) {
          const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Error exporting data');
      }
    }
    fetchData();

  }


  function CustomTableRow({ row,child,depth }: { row: any,child?: boolean,depth?: number }) {
    const [isOpen, setIsOpen] = useState(false)
    const [data,setdata] = useState('no')
    const [activehover,setactivehover] = useState(true)

    let depthin = depth||0;
    
  return (
    <>
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() && "selected"}
        className="border"

      >
        {row.getVisibleCells().map((cell:any, idx:number) => (
          <TableCell key={cell.id} >
              <div className={`flex items-center gap-2`} style={{ marginLeft: child && idx === 0 ? `${depthin * 12}px` : 0 }}>
                {idx==0 && <Checkbox
                  className="w-4 h-4 cursor-pointer"
                  checked={select.includes(cell.getValue() as string)}
                  onCheckedChange={(checked:boolean)=>{
                  setselect(checked ? [...select, cell.getValue() as string] : select.filter(s => s !== cell.getValue()))
                  }}
                />}
              {idx==0?<button className="cursor-pointer" onClick={()=>setIsOpen(!isOpen)}>{isOpen?<ChevronDown className="w-4 h-4"></ChevronDown>:<ChevronRight className="w-4 h-4"></ChevronRight>}</button>:""}

              {flexRender(cell.column.columnDef.cell, cell.getContext())}
              
              </div>
          </TableCell>
        ))}
      </TableRow>
      {isOpen && <CustomTableRow  row={row} child={true} depth={depthin+1} />}
    </>
  );
}
  return (
    <div className="rounded-md ">
      {select.length==1 && <div className="flex flex-col sm:flex-row  justify-between items-start sm:items-center gap-4 mb-4">
                            <div className="flex flex-row items-center gap-4 w-full sm:w-1/4  rounded-md bg-transparent px-4">
                             <button className="cursor-pointer hover:underline text-emerald-600">Edit</button>
                           <AlertDialog>
                            <AlertDialogTrigger> 
                              <button className="cursor-pointer hover:underline text-red-600">Delete</button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                            <AlertDialogTitle>Delete your data</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your account
                                  and remove your data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Continue</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                             <div className="text-gray-300">|</div>
                             <Dialog>
                            <DialogTrigger>    
                                <button className="cursor-pointer hover:underline text-emerald-600" onClick={()=>exportdata(select)}>Export</button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Exporting Data</DialogTitle>
                              </DialogHeader>
                                <div className="italic text-center">Downloading...</div>
                            </DialogContent>
                          </Dialog>
                            </div>
                         
                            
                        </div>}
      {select.length>1 && <div className="flex flex-col sm:flex-row  justify-between items-start sm:items-center gap-4 mb-4">
                            <div className="flex flex-row items-center gap-4 w-full sm:w-1/4  rounded-md bg-transparent px-4">
                             <div className="text-gray-300">|</div>
                            <Dialog>
                            <DialogTrigger>    
                                <button className="cursor-pointer hover:underline text-emerald-600" onClick={()=>exportdata(select)}>Export</button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                <DialogDescription>
                                  This action cannot be undone. This will permanently delete your account
                                  and remove your data from our servers.
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>                            </div>
                            </div>
}
      <Table className="bg-white dark:bg-inherit border">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header,idx) => {
                return (
                   
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      position: 'relative',
                    }}
                  >
                    <div className="flex gap-2 items-center">
                       {idx==0 && <Checkbox
                  className="w-4 h-4 cursor-pointer"
                  onCheckedChange={(checked:boolean)=>getAllId()}
                  
                />}
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`absolute right-0 top-0 h-full ${
                          header.column.getIsResizing()
                            ? 'bg-blue-500 w-1'
                            : 'bg-gray-300 w-0.5'
                        } cursor-col-resize transition-all`}
                        style={{
                          transform: 'translateX(30%)',
                          touchAction: 'none',
                        }}
                      />
                    )}
                    </div>
                  </TableHead>

                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (

                
              <CustomTableRow key={row.id} row={row} />

            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

