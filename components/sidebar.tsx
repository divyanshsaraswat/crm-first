'use client'
import {motion} from "motion/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"
import { Pill, UserCheck2, LucideContact2, Pen, Tag, Settings,ChevronDown,ChevronRight,Bell,ChevronsUpDownIcon, LucideGroup, PencilIcon, NotebookPenIcon, Building2, User2Icon, LockIcon, UserCircle2, ArrowLeftToLine, Navigation, NavigationIcon, SquareArrowOutUpLeft } from "lucide-react";
import { DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuItem } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
interface UserData {
  created_at: string;    
  email: string;
  id: string;
  parent_id: string;
  password_hash: string;
  role: string;
  updated_at: string; 
  username: string;
}

export default function Sidebar() {
      const [expanded, setExpanded] = useState(false)
      const [locked,setlocked]  = useState(false)
      const [isMobile, setIsMobile] = useState(false)
      const [active, setActive] = useState<number>(0)
      const router = useRouter()
   
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setExpanded(false);
      } else {
        setExpanded(false);
      }
    };

    const PreferencesSet = async () => {
      try {
        const token = await fetch(`/api/session`)
          .then((res:any) => res?.token)
          .catch((e) => console.error(e));
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/settings`, {
          credentials:"include",
          method:'GET',
          headers: {
            'Content-Type': 'application/json',
            Cookie:token
          },
        });
        const result = await res.json();
        console.log(result);
        const {
      currency,
      date_format,
      notify_browser,
      notify_email,
      notify_lead_alerts,
      notify_task_reminders,
      theme,
      time_format,
    } = result[0][0];

    const preferences = {
      currency,
      date_format,
      notify_browser,
      notify_email,
      notify_lead_alerts,
      notify_task_reminders,
      theme,
      time_format,
    };

    localStorage.setItem("preferences", JSON.stringify(preferences));
      } catch (e) {
        console.error('Error fetching preferences:', e);
        return null;
      }
    };

    checkIfMobile();
    PreferencesSet();
    window.addEventListener("resize", checkIfMobile);

    const pathname = window.location.pathname;
    const navItems = [
      { name: "Contacts", route: "/accounts", num: 0 },
      { name: "Tasks", route: "/tasks", num: 1 },
      { name: "Reports", route: "/reports", num: 2 },
      { name: "Settings", route: "/settings", num: 3 },
      { name: "Users", route:'/users', num:4}
    ];

    const match = navItems.find(item => pathname.startsWith(item.route));
    if (match) {
      setActive(match.num);
    }

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);
    return(
        <>
         <motion.aside
        className={cn(
          "static h-full hidden md:block bg-transparent text-white transition-all duration-300 ease-in-out z-10 h-screen",
          expanded || locked ? "w-64" : "w-16",
        )}
        initial={false}
        animate={{ width: expanded || locked ? 256 : 64 }}
        transition={{ duration: 0.1, ease: "easeInOut" }}
        onHoverStart={() => !isMobile || !locked?setExpanded(true):null}
        onHoverEnd={() => !isMobile || !locked?setExpanded(false):null}
        >
        {/* Logo */}
        <div className="flex items-center p-4 h-16 bg-transparent justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex-shrink-0 bg-emerald-700 p-2 rounded-full">
              <LucideGroup className="h-4 w-4 text-white" />
            </div>
            <motion.span
              className="font-bold text-xl whitespace-nowrap text-emerald-700"
              animate={{ opacity: expanded || locked ? 1 : 0 }}
              transition={{ duration: 0.1 }}
            >
              CRM First
            </motion.span>

          </div>
            <button className={`${locked?'text-black':'text-gray-300'} ${expanded ||locked?'flex':'hidden'} cursor-pointer`} onClick={()=>setlocked(!locked)}><SquareArrowOutUpLeft size={20} /></button>
        </div>

        {/* Menu Header */}
        <div className="px-4 py-8 flex justify-end w-full ">
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
            { name: "Contacts", icon: <UserCircle2 className="h-5 w-5 color-emerald-800" />, num:0,route:"/accounts" },
            { name: "Tasks", icon: <Pen className="h-5 w-5 color-emerald-800" />, num:1,route:"/tasks" },
            { name: "Reports", icon: <NotebookPenIcon className="h-5 w-5 color-emerald-800" />, num:2,route:"/reports" },
            { name: "Settings", icon: <Settings className="h-5 w-5 color-emerald-800" />, num:3,route:"/settings" },
            { name: "Users", icon: <User2Icon className="h-5 w-5 color-emerald-800" />, num:4,route:"/users" },
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
                className={cn("ml-3 whitespace-nowrap ", expanded || locked ? "opacity-100" : "opacity-0")}
                animate={{ opacity: expanded || locked ? 1 : 0, x: expanded || locked ? 0 : -10 }}
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
      const [data,setdata] = useState<UserData>()
      const [active, setActive] = useState<number>(0)
      const router = useRouter();
      const logout = async()=>{
        await fetch('/api/logout').then((res)=>{
          console.log(res)
          window.location.href='/login'
          
        }).catch((e)=>{
          console.error(e)
        })
      }
    useEffect(() => {
        const checkIfMobile = () => {
          setIsMobile(window.innerWidth < 1024)
          if (window.innerWidth < 1024) {
            setExpanded(false)
          } else {
            setExpanded(true)
          }
        }
          const fetchData = async () => {
          try {
            const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/verify`, {
              method: "GET",
              credentials: "include",
            });
            if (!result.ok) {
              throw new Error("Failed to fetch user verification");
            }
            const output = await result.json();
            setdata(output)
          } catch (error) {
            console.error("Error fetching user verification:", error);
          }
        }

        // Initial check
        checkIfMobile()
        fetchData()
    
        // Add event listener
        window.addEventListener("resize", checkIfMobile)
    
        // Cleanup
        return () => window.removeEventListener("resize", checkIfMobile)
      }, [])
    return(
        <>
         <header className="flex items-center justify-between h-16 px-6  bg-transparent ">
          <h1 className="text-xl font-semibold text-gray-800">
            {/* {isMobile && (
              <button onClick={() => setExpanded(!expanded)} className="mr-4 p-1 rounded-md hover:bg-gray-100">
                {expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </button>
            )} */}
            {/* <motion.span
              className="font-bold text-xl whitespace-nowrap text-emerald-700"
              
          
            >
              CRM First
            </motion.span> */}
          </h1>

          <div className="flex items-center gap-4 ">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="relative flex flex-row bg-transparent h-12 w-12 rounded-xl cursor-pointer">
                  <Bell className="h-12 w-12"/>
                    <div className="absolute right-4 top-3 w-2 h-2 bg-red-700 rounded-full animate-ping"></div>
                    <div className="absolute right-4 top-3 w-2 h-2 bg-red-700 rounded-full"></div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 md:w-100 backdrop-blur-md bg-white/20 border border-white/30 rounded-xl shadow-md">
                <DropdownMenuItem className="cursor-pointer">
                    <div className="flex flex-row items-center justify-start gap-10 w-full  p-2 rounded-md">
                    <Bell className="h-5 w-5 scale-150 text-gray-800 dark:text-white" />
                        <p className="text-sm font-semibold truncate">Notifications dfgnfdkjgndfgndfgk  kergjerkgj fgkjdfngkdfngkdfgkfdngdfngkjdfnjgndfkjgndfjgnkjdfgnkjdfngkjgndfkjngkjngkjdfngkjdfgkldfngkldfngk</p>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    <div className="flex flex-row items-center justify-start gap-10 w-full p-2 rounded-md">
                    <PencilIcon className="h-5 w-5 scale-150 text-gray-800 dark:text-white" />
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
                    <AvatarFallback>{data?.username.substring(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {data?(<div className="hidden md:flex  items-center justify-start gap-2 p-2 ">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-left">{data?.username}</p>
                    <p className="text-xs text-muted-foreground">{data?.email}</p>
                  </div>
                </div>):(
                  <div className="hidden md:flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <div className="h-4 w-24">
                        <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                      </div>
                      <div className="h-3 w-32">
                        <div className="h-3 w-full bg-gray-200 animate-pulse rounded" />
                      </div>
                    </div>
                  </div>
                )}
                  <ChevronsUpDownIcon className="hidden md:flex h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-fit md:w-56 backdrop-blur-md bg-white/20 border border-white/30 rounded-xl shadow-md">
                
                <DropdownMenuItem className="cursor-pointer hover:bg-grey-700 p-2" onClick={()=>router.push('/users')}>Manage Team</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-grey-700 p-2" onClick={()=>router.push('/settings')}>Profile</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-red-800 hover:bg-grey-700 p-2" onClick={()=>logout()}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        </>
    )
}