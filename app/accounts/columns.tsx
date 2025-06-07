"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Account = {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  status?: string;
  source_type?: string;
  assigned_user_id?: string;
  created_by_id?:string;
  updated_at?: string;
  Rating?: string;
  ContPerson?: string;
  Address1?: string;
  Zone?:string;
  Address2?: string;
  City?: string;
  Zip?: string;
  States?: string;
  Country?: string;
  phone?: string;
  waphone?: string;
  email?: string;
  JoiningDate?: string;
  SourceID?: string;
  designation_name?: string;
  BusinessNature?: string;
}


export const columns: ColumnDef<Account>[] = [
  "id",
  "name",
  "status_type",
  "source_type",
  "Rating",
  "ContPerson",
  "States",
  "phone",
  "email",
  "designation_name",
  "created_by_id",
  "industry",
  "website",
  "assigned_user_id",
  "updated_at",
  "Zone",
  "Address1",
  "Address2",
  "City",
  "Zip",
  "Country",
  "waphone",
  "JoiningDate",
  "BusinessNature",
  "SourceID",
  "DesignationID",
  "StatusID"
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