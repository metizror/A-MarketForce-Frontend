import React from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  Upload,
  Activity,
  Settings,
  LogOut,
  Shield,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import { UserObject } from "@/types/auth.types";
import marketForceLogo from "../assets/cf01cb1f3c35e00a009f17e0c1fd4855e8cb9ad1.png";
import Image from "next/image";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  exclusive?: boolean;
  badge?: number;
}

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  menuItems: MenuItem[];
  user: UserObject;
  onLogout: () => void;
  onSupportClick?: () => void;
  pendingRequestsCount?: number;
}

const iconMap = {
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  Upload,
  Activity,
  Settings,
  MessageCircle,
  CheckCircle2,
};

export function Sidebar({
  activeView,
  setActiveView,
  menuItems,
  user,
  onLogout,
  onSupportClick,
  pendingRequestsCount = 0,
}: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo & User Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-center mb-4 px-2">
          <Image src={marketForceLogo} alt="Market Force" width={150} height={150} />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-600 mb-2">{user.email}</p>
          <Badge
            variant={user.role === "superadmin" ? "default" : "secondary"}
            className="text-xs"
          >
            {user.role === "superadmin" && <Shield className="w-3 h-3 mr-1" />}
            {user.role === "superadmin" ? "Super Admin" : "Admin"}
          </Badge>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = activeView === item.id;
          const isExclusive = item.exclusive && user.role !== "superadmin";

          if (isExclusive) return null;

          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start h-10 relative ${
                isActive
                  ? user.role === "superadmin"
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-red-500 hover:bg-red-600"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setActiveView(item.id)}
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.label}
              {item.badge && item.badge > 0 && (
                <Badge className="ml-auto bg-red-500 text-white text-xs h-5 min-w-5 px-1.5 flex items-center justify-center">
                  {item.badge}
                </Badge>
              )}
              {item.exclusive && !item.badge && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Pro
                </Badge>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Support & Logout */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        {onSupportClick && (
          <Button
            variant="ghost"
            className="w-full justify-start h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={onSupportClick}
          >
            <MessageCircle className="w-4 h-4 mr-3" />
            Support
          </Button>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          onClick={() => {
            localStorage.removeItem("authState");
            localStorage.removeItem("authToken");
            window.location.href = "/";
          }}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
