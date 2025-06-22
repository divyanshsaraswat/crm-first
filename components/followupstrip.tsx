"use client"
import { useEffect,useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Building, MailPlus, MessageCircleCodeIcon, PhoneCallIcon } from "lucide-react"
import { CrmFollowUpModal } from "./forms";
export default function FollowUp({cdata,activehover}:{cdata:any,activehover:boolean}){
    const [data,setdata] = useState<any>({})
    const [openform,setopenform] = useState<boolean>(false);
    const setd = {"Email":{"icon":<MailPlus size={20}/>},"WhatsApp":{"icon":<MessageCircleCodeIcon size={20}/>},"Call":{"icon":<PhoneCallIcon size={20}/>},"Visit":{"icon":<Building size={20}/>}}
    const [loading,setloading] = useState<boolean>(true)
     useEffect(() => {
            const fetchData = async () => {
              
              const token = await fetch('/api/session').then((res:any)=>{return res?.token}).catch((e)=>console.error(e))
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/followup`,{
                credentials:'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': token
                }
              }).then(async(res)=>{
                const result = await res.json()
                setdata(result?.message[0])
                console.log(result?.message[0])
                setloading(true)
            }).catch((e)=>{console.error(e)})
            }
            fetchData()

            
          },[]);
    return(
      <>
        <div className={`absolute left-10  overflow-hidden transition-all  duration-150 ${activehover ? 'w-40  pr-8 ' : 'w-0'} `} style={{background:"linear-gradient(90deg, rgb(251, 251, 251,1) 80%, rgba(245, 245, 245, 0) 100%)"}}>
                <div className="flex flex-row gap-4 h-fit">
                  {data.length>0?data.map((res:any,idx:number)=>{
                    return (
                       <Tooltip key={idx}>
                  <TooltipTrigger>
                <button className="cursor-pointer hover:text-emerald-500" onClick={()=>setopenform(true)}>{setd[res?.ftype]?.icon}</button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{res.ftype}</p>
                  </TooltipContent>
                </Tooltip>
                    )
                  }):<div>Loading...</div>}
                 
                </div>
                </div>
                {openform && <CrmFollowUpModal id={cdata?.id}/>}
                </>
    )
}