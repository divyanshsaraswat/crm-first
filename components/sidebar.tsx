'use client'
import {motion} from "motion/react";
import { cn } from "@/lib/utils"
import { Pill, UserCheck2, LucideContact2, Pen, Tag, Settings,ChevronDown,ChevronRight,Bell,ChevronsUpDownIcon, LucideGroup, PencilIcon, NotebookPenIcon } from "lucide-react";
import { DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuItem } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Sidebar() {
      const [expanded, setExpanded] = useState(false)
      const [isMobile, setIsMobile] = useState(false)
      const [active, setActive] = useState<number>(0)
      const router = useRouter()
    useEffect(() => {
        const checkIfMobile = () => {
          setIsMobile(window.innerWidth < 1024)
          if (window.innerWidth < 1024) {
            setExpanded(false)
          } else {
            setExpanded(false)
          }
        }
    
        // Initial check
        checkIfMobile()
    
        // Add event listener
        window.addEventListener("resize", checkIfMobile)
    
        // Cleanup
        return () => window.removeEventListener("resize", checkIfMobile)
      }, [])
    return(
        <>
         <motion.aside
        className={cn(
          "static h-full bg-transparent text-white transition-all duration-300 ease-in-out z-10",
          expanded ? "w-64" : "w-16",
        )}
        initial={false}
        animate={{ width: expanded ? 256 : 64 }}
        transition={{ duration: 0.1, ease: "easeInOut" }}
        onHoverStart={() => !isMobile && setExpanded(true)}
        onHoverEnd={() => !isMobile && setExpanded(false)}
      >
        {/* Logo */}
        <div className="flex items-center p-4 h-16 bg-transparent">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex-shrink-0 bg-emerald-700 p-2 rounded-full">
              <LucideGroup className="h-4 w-4 text-white" />
            </div>
            <motion.span
              className="font-bold text-xl whitespace-nowrap text-emerald-700"
              animate={{ opacity: expanded ? 1 : 0 }}
              transition={{ duration: 0.1 }}
            >
              CRM
            </motion.span>
          </div>
        </div>

        {/* Menu Header */}
        <div className="px-4 py-8">
          <motion.p
            className="text-xs font-semibold text-emerald-300 mb-2"
            animate={{ opacity: expanded ? 1 : 0 }}
            transition={{ duration: 0.3}}
          >
           
          </motion.p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 px-2">
          {[
            { name: "Users", icon: <UserCheck2 className="h-5 w-5"/>, num:0,route:"/users" },
            { name: "Contacts", icon: <LucideContact2 className="h-5 w-5 color-emerald-800" />, num:1,route:"/contacts" },
            { name: "Tasks", icon: <Pen className="h-5 w-5 color-emerald-800" />, num:2,route:"/users" },
            { name: "Leads", icon: <Tag className="h-5 w-5 color-emerald-800" />, num:3,route:"/users" },
            { name: "Reports", icon: <NotebookPenIcon className="h-5 w-5 color-emerald-800" />, num:4,route:"/users" },
            { name: "Settings", icon: <Settings className="h-5 w-5 color-emerald-800" />, num:5,route:"/settings" },
          ].map((item) => (
            <motion.button
              key={item.name}
              className={cn(
                "flex items-center w-full rounded-lg p-3 cursor-pointer text-sm font-medium transition-colors dark:text-white",
                active==item.num ? "bg-emerald-800 text-white " : "text-black hover:bg-emerald-800 hover:text-white",
              )}
              whileHover={{ scale: 1.02 }}
              onClick={()=>{
                setActive(item.num)
                setExpanded(false)
                router.push(item.route)
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <motion.span
                className={cn("ml-3 whitespace-nowrap ", expanded ? "opacity-100" : "opacity-0")}
                animate={{ opacity: expanded ? 1 : 0, x: expanded ? 0 : -10 }}
                transition={{ duration: 0.5 }}
              >
                {item.name}
              </motion.span>
            </motion.button>
          ))}
        </nav>
      </motion.aside>
        </>
    )
}

export function Header(){
          const [expanded, setExpanded] = useState(true)
      const [isMobile, setIsMobile] = useState(false)
      const [active, setActive] = useState<number>(0)
    useEffect(() => {
        const checkIfMobile = () => {
          setIsMobile(window.innerWidth < 1024)
          if (window.innerWidth < 1024) {
            setExpanded(false)
          } else {
            setExpanded(true)
          }
        }
    
        // Initial check
        checkIfMobile()
    
        // Add event listener
        window.addEventListener("resize", checkIfMobile)
    
        // Cleanup
        return () => window.removeEventListener("resize", checkIfMobile)
      }, [])
    return(
        <>
         <header className="flex items-center justify-between h-16 px-6  bg-transparent ">
          <h1 className="text-xl font-semibold text-gray-800">
            {isMobile && (
              <button onClick={() => setExpanded(!expanded)} className="mr-4 p-1 rounded-md hover:bg-gray-100">
                {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
            )}
          </h1>

          <div className="flex items-center gap-4 ">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="relative flex flex-row bg-transparent h-12 w-12 rounded-xl cursor-pointer">
                  <Bell className="h-12 w-12"/>
                  <div className="absolute right-4 top-3 w-2 h-2 bg-red-700 rounded-full"></div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 md:w-100 backdrop-blur-md bg-white/20 border border-white/30 rounded-xl shadow-md">
                <DropdownMenuItem className="cursor-pointer">
                    <div className="flex flex-row items-center justify-start gap-10 w-full hover:bg-gray-200 p-2 rounded-md">
                    <Bell className="h-5 w-5 scale-150 text-gray-800" />
                        <p className="text-sm font-semibold truncate">Notifications dfgnfdkjgndfgndfgk  kergjerkgj fgkjdfngkdfngkdfgkfdngdfngkjdfnjgndfkjgndfjgnkjdfgnkjdfngkjgndfkjngkjngkjdfngkjdfgkldfngkldfngk</p>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    <div className="flex flex-row items-center justify-start gap-10 w-full hover:bg-gray-200 p-2 rounded-md">
                    <PencilIcon className="h-5 w-5 scale-150 text-gray-800" />
                        <p className="text-sm font-semibold truncate">Notifications dfgnfdkjgndfgndfgk  kergjerkgj fgkjdfngkdfngkdfgkfdngdfngkjdfnjgndfkjgndfjgnkjdfgnkjdfngkjgndfkjngkjngkjdfngkjdfgkldfngkldfngk</p>
                    </div>
                </DropdownMenuItem>
              
              </DropdownMenuContent>
            </DropdownMenu>






            
            <DropdownMenu >
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative flex flex-row h-14 w-fit py-5 rounded-md cursor-pointer hover:bg-gray-200">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png" alt="User" />
                    <AvatarFallback>BS</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex  items-center justify-start gap-2 p-2 ">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-left">Budiono Siregar</p>
                    <p className="text-xs text-muted-foreground">budiono.sire@gmail.com</p>
                  </div>
                </div>
                  <ChevronsUpDownIcon className="hidden md:flex h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-fit md:w-56 backdrop-blur-md bg-white/20 border border-white/30 rounded-xl shadow-md">
                
                <DropdownMenuItem className="cursor-pointer hover:bg-grey-700 p-2">Profile</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-grey-700 p-2">Settings</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-red-800 hover:bg-grey-700 p-2">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        </>
    )
}