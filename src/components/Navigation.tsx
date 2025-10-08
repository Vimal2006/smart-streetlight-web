import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BarChart3 } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/20 border border-primary flex items-center justify-center glow-primary">
              <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <h1 className="text-sm sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Smart City Monitor
            </h1>
          </div>
          
          <div className="flex space-x-0.5 sm:space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-primary/20 text-primary border border-primary glow-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-xs sm:text-base">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
