'use client'
import {motion} from "motion/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"
import { Pill, UserCheck2, LucideContact2, Pen, Tag, Settings,ChevronDown,ChevronRight,Bell,ChevronsUpDownIcon, LucideGroup, PencilIcon, NotebookPenIcon, Building2, User2Icon, LockIcon, UserCircle2, ArrowLeftToLine, Navigation, NavigationIcon, SquareArrowOutUpLeft } from "lucide-react";
import { DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuItem } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useState,useEffect, use } from "react";
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

function SidebarIn() {
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

        if (result[0]?.length>0){

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
        }


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
function MobileTabNavigator() {
  const [active, setActive] = useState<number>(0)
  const router = useRouter()

  const navItems = [
    { name: "Contacts", icon: UserCircle2, route: "/accounts", num: 0 },
    { name: "Tasks", icon: Pen, route: "/tasks", num: 1 },
    { name: "Reports", icon: NotebookPenIcon, route: "/reports", num: 2 },
    { name: "Settings", icon: Settings, route: "/settings", num: 3 },
    { name: "Users", icon: User2Icon, route: "/users", num: 4 },
  ]

  useEffect(() => {
    const pathname = window.location.pathname
    const match = navItems.find((item) => pathname.startsWith(item.route))
    if (match) {
      setActive(match.num)
    }
  }, [])

  const handleNavigation = (item: (typeof navItems)[0]) => {
    setActive(item.num)
    router.push(item.route)
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const IconComponent = item.icon
          return (
            <motion.button
              key={item.name}
              onClick={() => handleNavigation(item)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg min-w-0 flex-1 transition-colors",
                active === item.num ? "text-emerald-700" : "text-gray-500 hover:text-emerald-600",
              )}
              whileTap={{ scale: 0.95 }}
            >
              <IconComponent
                className={cn("h-5 w-5 mb-1", active === item.num ? "text-emerald-700" : "text-gray-500")}
              />
              <span
                className={cn(
                  "text-xs font-medium truncate",
                  active === item.num ? "text-emerald-700" : "text-gray-500",
                )}
              >
                {item.name}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
export default function Sidebar() {
  return (
    <>
      <SidebarIn />
      <MobileTabNavigator />
    </>
  )
}
export function Notifications(){
  const [notify, setNotify] = useState<any>(null);
  const [token,settoken] = useState<string>();
  const [isreads,setisreads]= useState<boolean>();
  useEffect(() => {
    const fetchData = async () => {
      const token = await fetch('/api/session').then((res:any)=>{return res?.token}).catch((e)=>console.error(e))
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/notifications`,
        {
          credentials:"include",
          headers:{
            "Cookie":token
          }
        }
      );
      if (result.ok) {
        const data = await result.json();
        setNotify(data);
        const hasUnreadNotifications = data?.notifications?.some((notification:any) => !notification.is_read);
        console.log(hasUnreadNotifications)
        setisreads(hasUnreadNotifications);
        console.log(data);
      }
    };
    fetchData();
  }, []);
  return(
     <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="relative flex flex-row bg-transparent h-12 w-12 rounded-xl cursor-pointer">
                  <Bell className="h-12 w-12"/>
                    {isreads && (
                      <div className="absolute right-4 top-3">
                        <div className="w-2 h-2 bg-red-700 rounded-full animate-ping"></div>
                        <div className="w-2 h-2 bg-red-700 rounded-full absolute inset-0"></div>
                      </div>
                    )}
                </Button> 
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 md:w-96 max-h-80 backdrop-blur-md bg-white/20 border border-white/30 rounded-xl shadow-md overflow-y-scroll">
                
                {notify?notify.notifications?.map((res:any,idx:any)=>{
                  return  (
                    <DropdownMenuItem 
                    key={idx} 
                    className="cursor-pointer"
                    onMouseEnter={async () => {
                      if (!res.is_read) {
                      try {
                        

                        const headers: HeadersInit = {
                          'Content-Type': 'application/json'
                        };
                        if (token) {
                          headers.Cookie = token;
                        }
                        await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/notifications/${res.id}/read`, {
                          method: 'PATCH',
                          credentials: 'include',
                          headers
                        });
                        // Update the local state to mark as read
                        res.is_read = true;
                      } catch (error) {
                        console.error('Error marking notification as read:', error);
                      }
                      }
                    }}
                    >
                    <div className="flex flex-row items-center justify-start gap-10 w-full p-2 rounded-md">
                      <div className="relative">
                      <Bell className="h-5 w-5 scale-150 text-gray-800 dark:text-white" />
                      <div className={`${!res.is_read ? 'flex' : 'hidden'} absolute left-2 bottom-3 w-2 h-2 bg-red-700 rounded-full`}></div>
                      </div>
                      <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold truncate">{res.title}</p>
                      <p className="text-xs font-semibold truncate">{res.message}</p>
                      </div>
                    </div>
                    </DropdownMenuItem>
                )}):(
                  <DropdownMenuItem className="cursor-default">
                    <div className="flex flex-col items-center justify-center w-full py-4 px-2">
                      <Bell className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 text-center">No notifications yet</p>
                      <p className="text-xs text-gray-400 text-center mt-1">We'll notify you when something arrives</p>
                    </div>
                  </DropdownMenuItem>
                )
                 }
             
              
              </DropdownMenuContent>
            </DropdownMenu>
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
           

              <Notifications/>




            
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