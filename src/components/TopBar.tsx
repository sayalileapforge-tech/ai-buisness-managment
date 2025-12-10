import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import "../styles/TopBar.css";

interface TopBarProps {
  onMenuClick: () => void;
  onRoleChange?: (role: string) => void;
}

export default function TopBar({ onMenuClick, onRoleChange }: TopBarProps) {
  const [roleDropdown, setRoleDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Owner (Full Access)");
  const { user } = useAuth();
  const navigate = useNavigate();

  const roles = [
    "Owner (Full Access)",
    "Accountant",
    "Manager",
    "Employee"
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const userName = user?.displayName || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "no-email@example.com";

  return (
    <div className="top-bar">
      <button className="sidebar-toggle" onClick={onMenuClick}>
        <Menu size={20} />
      </button>

      <div className="topbar-right">
        <div className="role-dropdown-wrapper">
          <button className="switch-role-btn" onClick={() => setRoleDropdown(!roleDropdown)}>
            Switch Role
          </button>
          {roleDropdown && (
            <div className="role-dropdown-menu">
              {roles.map((role, idx) => (
                <div
                  key={idx}
                  className={`role-option ${role === selectedRole ? "active" : ""}`}
                  onClick={() => {
                    setSelectedRole(role);
                    setRoleDropdown(false);
                    onRoleChange?.(role);
                  }}
                >
                  {role}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="user-menu">
          <Bell size={18} className="notif-icon" />
          <div className="user-menu-wrapper">
            <button
              className="user-profile-btn"
              onClick={() => setUserDropdown(!userDropdown)}
            >
              <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
              <div className="user-info">
                <div className="user-name">{userName}</div>
                <div className="user-role">{selectedRole}</div>
              </div>
            </button>

            {userDropdown && (
              <div className="user-dropdown-menu">
                <div className="user-dropdown-header">
                  <div className="user-avatar-large">{userName.charAt(0).toUpperCase()}</div>
                  <div>
                    <div className="dropdown-user-name">{userName}</div>
                    <div className="dropdown-user-email">{userEmail}</div>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item">
                  <UserIcon size={16} />
                  Profile Settings
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item logout" onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
