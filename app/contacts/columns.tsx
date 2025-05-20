"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Contacts = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  account_id: string
  contact_owner_id: string
  updated_at?: string
}

export const columns: ColumnDef<Contacts>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableResizing:true,
  },
  {
    accessorKey: "first_name",
    header: "First Name",
    enableResizing:true,
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
    enableResizing:true,
  },
  {
    accessorKey: "email",
    header: "Email",
    enableResizing:true,
  },
  {
    accessorKey: "phone",
    header: "Phone No.",
    enableResizing:true,
  },
  {
    accessorKey: "account_id",
    header: "Company",
    enableResizing:true,
  },
  {
    accessorKey: "contact_owner_id",
    header: "Managed By",
    enableResizing:true,
  },
  {
    accessorKey: "updated_at",
    header: "Updated At",
    enableResizing:true,
  }
]
