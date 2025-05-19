"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

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
import { BoxSelect, ChevronDown, ChevronLeft, ChevronRight, Dot, EllipsisVertical, OptionIcon, PencilIcon } from "lucide-react" // Optional icons

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  console.log(data);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Add this line
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  })
  function CustomTableRow({ row,child,depth }: { row: any,child?: boolean,depth?: number }) {
    const [isOpen, setIsOpen] = useState(false)
    const [data,setdata] = useState('no')
    const [activehover,setactivehover] = useState(true)
    
    let depthin = depth||0;
  function Options({children}:ReactNode){
    return(
      <>
      <Menubar className="bg-transparent h-fit border-none shadow-none">
        <MenubarMenu>
          <MenubarTrigger className="p-0 h-0 bg-none">{children}</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Edit<MenubarShortcut><PencilIcon/></MenubarShortcut></MenubarItem> 
            <MenubarItem>Select <MenubarShortcut><BoxSelect></BoxSelect></MenubarShortcut></MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      </>
    )
  }
  return (
    <>
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() && "selected"}
        className="border"
        

      >
        {row.getVisibleCells().map((cell:any, idx:number) => (
          <TableCell key={cell.id}>
              <div className={`flex items-center gap-1`} style={{ marginLeft: child && idx === 0 ? `${depthin * 12}px` : 0 }}>
              {idx==0 && activehover?<Options><button className="cursor-pointer">{<EllipsisVertical className="w-4 h-4"/>}</button></Options>:""}
              {idx==0?<button className="cursor-pointer" onClick={()=>setIsOpen(!isOpen)}>{isOpen?<ChevronDown className="w-4 h-4"/>:<ChevronRight className="w-4 h-4"></ChevronRight>}</button>:""}
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
      <Table className="bg-white dark:bg-inherit border">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      position: 'relative',
                    }}
                  >
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

