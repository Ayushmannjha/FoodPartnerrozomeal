import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/animated-sidebar";
import { 
  LayoutDashboard, 
  UserCog, 
  Settings, 
  LogOut, 
  History, 
  Package, 
  UtensilsCrossed 
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

/**
 * Animated Sidebar Layout for Dashboard Pages
 * 
 * Usage in AppRouter.tsx:
 * <Route element={<AnimatedSidebarLayout />}>
 *   <Route path="/dashboard" element={<DashboardHome />} />
 *   <Route path="/profile" element={<ProfilePage />} />
 *   ...
 * </Route>
 */
export function AnimatedSidebarLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
    {
      label: "Orders",
      href: "/orders",
      icon: (
        <Package className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
    {
      label: "Assigned Food",
      href: "/assigned-food",
      icon: (
        <UtensilsCrossed className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
    {
      label: "History",
      href: "/history",
      icon: (
        <History className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
        <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
  ];

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "FP";
    return user.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-neutral-900">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          
          {/* User Profile & Logout */}
          <div className="flex flex-col gap-2">
            <SidebarLink
              link={{
                label: user?.name || "Food Partner",
                href: "/profile",
                icon: (
                  <div className="h-7 w-7 shrink-0 rounded-full bg-linear-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-semibold">
                    {getUserInitials()}
                  </div>
                ),
              }}
            />
            <button
              onClick={handleLogout}
              className="flex items-center justify-start gap-2 group/sidebar py-2 text-left w-full"
            >
              <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
              <motion.span
                animate={{
                  display: open ? "inline-block" : "none",
                  opacity: open ? 1 : 0,
                }}
                className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre"
              >
                Logout
              </motion.span>
            </button>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      to="/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
    >
      <div className="h-8 w-8 bg-linear-to-br from-orange-500 to-red-600 rounded-lg shrink-0 flex items-center justify-center">
        <UtensilsCrossed className="h-5 w-5 text-white" />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-semibold text-lg text-black dark:text-white whitespace-pre"
      >
        Rozomeal
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      to="/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-8 w-8 bg-linear-to-br from-orange-500 to-red-600 rounded-lg shrink-0 flex items-center justify-center">
        <UtensilsCrossed className="h-5 w-5 text-white" />
      </div>
    </Link>
  );
};
