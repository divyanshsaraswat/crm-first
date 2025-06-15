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
import { Addfield, CrmUsersEditModal } from "@/components/forms"
import { CrmUsersModal } from "@/components/forms"
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
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  VisibilityState,
  ColumnFiltersState,
  useReactTable,
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
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
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button" // For pagination buttons
import { BoxSelect, ChevronDown, ChevronLeft, ChevronRight, Columns3,FilterIcon,X } from "lucide-react" // Optional icons
import { useRouter } from "next/navigation"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data
}: DataTableProps<TData, TValue>) {
  const [select, setselect] = useState<string[]>([])
  const router = useRouter();
  const [sorting,setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] =useState<VisibilityState>({})
  const [searchTerm, setSearchTerm] = useState<ColumnFiltersState>([])
  const [addfield, setaddfield] = useState<number>(0)
  const [loading, setloading] = useState<boolean>(false)
  const [opendialog,setopendialog] = useState(false);
  const [typing, settyping] = useState<string>('')
  const [refresh,setrefresh] = useState<boolean>(false);
  const globalFilterFn = (row: any, columnId: string, filterValue: string) => {
    const search = String(filterValue || '').toLowerCase();
    const columns = ["email", "username"];
    const valuesToSearch = columns.map(column => {
      try {
        return row.getValue(column);
      } catch {
        return '';
      }
    });

    return valuesToSearch.some(value => 
      String(value || '').toLowerCase().includes(search)
    );
};

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), 
    onSortingChange:setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel:getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state:{
      sorting,
      columnVisibility,
      globalFilter:searchTerm
    },
    onGlobalFilterChange:setSearchTerm,
    globalFilterFn:globalFilterFn,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  })
  const getAllId = () => {
    setselect([])
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': token
          },
        });
        if (response.ok) {
          console.log('Data deleted successfully');
        } else {
          console.error('Error deleting data');
        }
      }
      fetchData();
       setTimeout(()=>{
      window.location.reload();
    },1500)

  }
  const exportdata = (data:string[])=>{
    const fetchData = async () => {
      const token = await fetch('/api/session').then((res:any)=>{return res?.token}).catch((e)=>console.error(e))
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/export`, {
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
      }  else {
        console.error('Error exporting data');
      }
    }
    fetchData();
  }
  function CustomTableRow({ row, child, depth }: { row: any, child?: boolean, depth?: number }) {
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
        {row.getVisibleCells().map((cell: any, idx: number) => (
          <TableCell key={cell.id}>
            <div
              className={`flex items-center gap-1`}
              style={{
                marginLeft: child && idx === 0 ? `${depthin * 12}px` : 0,
              }}
            >
              {idx == 0 && (
                <Checkbox
                  className="w-4 h-4 cursor-pointer"
                  checked={select.includes(cell.getValue() as string)}
                  onCheckedChange={(checked: boolean) => {
                    setselect(
                      checked
                        ? [...select, cell.getValue() as string]
                        : select.filter((s) => s !== cell.getValue())
                    );
                  }}
                />
              )}
              {idx == 0 ? (
                <button
                  className="cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4"></ChevronRight>
                  )}
                </button>
              ) : (
                ""
              )}

                {cell.column.id === "created_at"
                ? new Date(cell.getValue() as string).toLocaleString("en-IN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: JSON.parse(localStorage.getItem('preferences') || '{}').time_format === '12h',
                  timeZone: "Asia/Kolkata"
                })
                : flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          </TableCell>
        ))}
      </TableRow>
      {isOpen && <CustomTableRow row={row} child={true} depth={depthin + 1} />}
    </>
  );
}
  const defaultVisibility: VisibilityState = {
  id: true,
  username: true,
  email: true,
  role: true,
  parent_id: true,
  created_at: true
};
const getColumnVisibilityFromLocalStorage = (): VisibilityState => {
  try {
    const data = localStorage.getItem('users');
    if (!data) return defaultVisibility;

    const visibleKeys: string[] = JSON.parse(data); // directly a string array
    if (!Array.isArray(visibleKeys)) return defaultVisibility;

    const normalizedVisibleKeys = visibleKeys.map(k => k.trim().toLowerCase());

    const updatedVisibility: VisibilityState = {};
    for (const key in defaultVisibility) {
      updatedVisibility[key] = normalizedVisibleKeys.includes(key.toLowerCase());
    }

    console.log(updatedVisibility);
    return updatedVisibility;
  } catch (error) {
    console.error('Failed to parse accounts from localStorage', error);
    return defaultVisibility;
  }
};
useEffect(() => {
    const visibility = getColumnVisibilityFromLocalStorage();
    console.log('Vibl',visibility);
    setColumnVisibility(visibility);
  }, []);
  return (
    <div className="rounded-md ">
      <div className="flex flex-col sm:flex-row  justify-between items-start sm:items-center gap-4 mb-4">
                            <div className="flex flex-row items-center gap-2 w-full sm:w-1/4  rounded-md bg-transparent px-2">
                                <input
                                    type="input"
                                    placeholder="Search users..."
                                     value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                                    onChange={(event) =>
                                      table.getColumn("email")?.setFilterValue(event.target.value)
                                    }
                                    className="w-full px-3 py-2 rounded-md border-input bg-transparent border-b focus:outline-none focus:border-emerald-500 focus:ring-0"
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
                            <div className="flex gap-2 w-full md:w-fit justify-between">
                                
                             
                                <Dialog open={opendialog} onOpenChange={()=>{
                                 
                                          const visibleColumns = table
                                            .getAllColumns()
                                            .filter((column) => column.getCanHide() && column.getIsVisible())
                                            .map((column) => column.id);

                                         
                                          localStorage.setItem('users', JSON.stringify(visibleColumns));

                                        
                                          setopendialog(!opendialog);
                                     
                                }}>
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
                                        {table
                                          .getAllColumns()
                                          .filter(
                                            (column) => column.getCanHide()
                                          )
                                          .map((column,idx) => {
                                            return (
                                              <>
                                              <div
                                                key={idx}
                                                className="flex items-center space-x-2 capitalize px-4 py-2 cursor-pointer hover:bg-gray-100 border"
                                                onClick={() => column.toggleVisibility(!column.getIsVisible())}
                                              >
                                                <Checkbox
                                                  checked={column.getIsVisible()}
                                                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                                />
                                                <span>{column.id}</span>
                                              </div>
                                              </>
                                            )
                                          })}
                                        <MenubarSeparator />
                                          {addfield==1 && <Addfield/>}
                                          <Button variant="outline" onClick={()=>{
                                            addfield==0?setaddfield(1):setaddfield(0)
                                          }} className={`${addfield==1?'hidden':'flex'}`}>Add Field</Button>
                                          <Button onClick={() => {
                                          const visibleColumns = table
                                            .getAllColumns()
                                            .filter((column) => column.getCanHide() && column.getIsVisible())
                                            .map((column) => column.id);

                                         
                                          localStorage.setItem('users', JSON.stringify(visibleColumns));

                                        
                                          setopendialog(false);
                                        }} className={`${addfield==1?'hidden':'flex'}`}>Close</Button>
                                          
                                    </DialogContent>
                                </Dialog>
                                <CrmUsersModal/>
                            </div>
                            
                        </div>
       {select.length==1 && <div className="flex flex-col sm:flex-row  justify-between items-start sm:items-center gap-4 mb-4">
                            <div className="flex flex-row items-center gap-4 w-full sm:w-1/4  rounded-md bg-transparent px-4">
                             <CrmUsersEditModal data={table.getCoreRowModel().rows.filter(row=>row.getValue('id')===select[0])}/>
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
                                    <AlertDialogAction onClick={()=>{
                                     
                                    deleteId(select[0])
                                    setrefresh(!refresh)
                                  }}>Continue</AlertDialogAction>
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
                                <DialogTitle>Exporting Data</DialogTitle>

                              </DialogHeader>
                                <div className="italic text-center">Downloading...</div>

                            </DialogContent>
                          </Dialog>                      
                           </div>
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
            table.getRowModel().rows.map((row) =>{
              
              return (
                <CustomTableRow key={row.id} row={row}/>
              )
            } )) : (
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

