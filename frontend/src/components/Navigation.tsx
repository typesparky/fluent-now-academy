import { Home, Mic, TrendingUp, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { useIsMobile } from "../hooks/use-mobile";

const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/speaking-gym", icon: Mic, label: "Speaking Gym" },
    { path: "/progress", icon: TrendingUp, label: "Progress" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-around py-2">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    "flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 relative",
                    isActive
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                  )}
                >
                  {isActive && (
                    <div className="absolute -top-1 w-2 h-2 rounded-full bg-indigo-600"></div>
                  )}
                  <Icon className={cn(
                    "w-6 h-6 mb-1 transition-all",
                    isActive && "scale-110"
                  )}
                  fill={isActive ? "currentColor" : "none"}
                  />
                  <span className="text-xs font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    );
  }

  // Desktop sidebar navigation
  return (
    <nav className="px-6">
      <div className="space-y-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative group",
                isActive
                  ? "text-indigo-600 bg-indigo-50 shadow-sm"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r"></div>
              )}
              <Icon className={cn(
                "w-5 h-5 transition-all",
                isActive && "scale-110"
              )}
              fill={isActive ? "currentColor" : "none"}
              />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;