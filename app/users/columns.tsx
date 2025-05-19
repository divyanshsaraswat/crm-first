"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Users = {
  id: string
  username: number
  email: string
  parent_id:string
  created_at: string
}

export const columns: ColumnDef<Users>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableResizing:true,
  },
  {
    accessorKey: "username",
    header: "Username",
    enableResizing:true,
  },
  {
    accessorKey: "email",
    header: "Email",
    enableResizing:true,
  },
  {
    accessorKey: "parent_id",
    header: "Managed By",
    enableResizing:true,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    enableResizing:true,
  },
]
