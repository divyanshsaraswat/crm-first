'use client'
import { useEffect, useState } from "react";
import { CrossIcon, Loader2, X,Check } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import FollowUp from "./followupstrip";

export default function NestedTable({did}:any){
  const [data,setdata] = useState<string[]>([]);
  const [loading,setloading] = useState(false);
  const statusbadges = (line: string) => {
    const objec: { [key: string]: string } = {
      "OPEN": "green",
      "REJECT": "red", 
      "HOLD": "yellow",
      "COMPLETED": "transparent"
    }
    return (
      <Badge variant="outline"  style={{background: objec[line] || 'transparent',color:line=='OPEN'?"white":"black"}}>
      {line}
      </Badge>
    )
   
  }
  function RowTable({item,index}:any){
  const [activehover,setactivehover] = useState<boolean>(false);
  return(
    <tr key={index}      onMouseMove={()=>setactivehover(true)}
        onMouseLeave={()=>setactivehover(false)}>
            <td className="px-4 py-2 border flex flex-row">
              {item.id}
            <FollowUp cdata={did}  activehover={activehover}/>
              
            </td>
            <td className="px-4 py-2 border">{statusbadges(item.status)}</td>
            <td className="px-4 py-2 border">{item.subject}</td>
            <td className="px-4 py-2 border">{item.body}</td>
            <td className="px-4 py-2 border">{(item.due_date).toString()}</td>
            <td className="px-4 py-2 border">{item.assigned_user_id}</td>
            <td className="px-4 py-2 border">{item.created_by}</td>
      
          </tr>
  )
}
  useEffect(() => {
          const fetchData = async () => {
            
            const token = await fetch('/api/session').then((res:any)=>{return res?.token}).catch((e)=>console.error(e))
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/tasks/${did?.id}`,{
              credentials:'include',
              headers: {
                  'Content-Type': 'application/json',
                  'Cookie': token
              }
            }).then(async(res)=>{
              const result = await res.json()
              setdata(result?.message[0])
              console.log(result?.message[0])
              console.log("Parent",did);
              setloading(true)
          }).catch((e)=>{console.error(e)})
          }
          fetchData()
          
        },[]);
    if (loading){
      return(
        <table className="w-screen table-auto border border-gray-300 p-5">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Subject</th>
            <th className="px-4 py-2 border">Body</th>
            <th className="px-4 py-2 border">Due Date</th>
            <th className="px-4 py-2 border">Assigned User</th>
            <th className="px-4 py-2 border">Created By</th>
          </tr>
        </thead>
        <tbody>
          {data.length>0?data.map((item:any,index:any)=>{
            return(
              <>
            {/* <div className="absolute left-0 border">a</div> */}
          {/* <tr key={index}>
            <td className="px-4 py-2 border">{item.id}

              
            </td>
            <td className="px-4 py-2 border">{statusbadges(item.status)}</td>
            <td className="px-4 py-2 border">{item.subject}</td>
            <td className="px-4 py-2 border">{item.body}</td>
            <td className="px-4 py-2 border">{item.due_date}</td>
            <td className="px-4 py-2 border">{item.assigned_user_id}</td>
            <td className="px-4 py-2 border">{item.created_by}</td>
      
          </tr> */}
          <RowTable key={index} item={item} index={index}/>
          </>
            );
          }):(
            <tr>
              <td colSpan={7} className="flex flex-row justify-center items-center p-5 gap-5"><X size={20} color="red"/>No Tasks Found.</td>
            </tr>
          )}
          
        </tbody>
      </table>
    )
    }
    else{
      return(
        <div className="flex flex-row items-center gap-2 justify-start h-28">
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span className="text-gray-500">Tasks loading...</span>
                      </div>
      )
    }
    
}