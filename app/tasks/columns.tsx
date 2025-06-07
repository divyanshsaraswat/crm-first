"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Task = {
  id: string; // uniqueidentifier
  subject?: string; // varchar(255)
  body?: string; // nvarchar(MAX)
  status_id?:string;
  status?: string; // varchar(50)
  due_date?: string; // date
  assigned_user?:string;
  contact_id?: string; // uniqueidentifier
  created_at?: string; // datetime2(7)
  assigned_user_id?: string; // uniqueidentifier
  updated_at?: string; // datetime2(7)
};


export const columns: ColumnDef<Task>[] = [
  "id",
  "status",
  "subject",
  "body",
  "due_date",
  "assigned_user",
  "created_by",
  "assigned_user_id",
  "status_id",
  "contact_id",
  "created_at",
  "updated_at"
].map((key) => ({
  accessorKey: key,
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {key.charAt(0).toUpperCase() + key.slice(1)}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  enableResizing: true,
}))