import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Home, LogOut, LucideHistory, User } from "lucide-react";

export default function Sidebar() {
  const { logout } = useContext(AppContext);
  const rows = [
    {
      label: "Dashboard",
      to: "/",
      icon: <Home size={16} />,
    },
    {
      label: "History",
      to: "/history",
      icon: <LucideHistory size={16} />,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-bg-default border-r border-gray-200 flex flex-col">
      <Header />
      <Navigation rows={rows} />
      <LogoutButton logout={logout} />
    </aside>
  );
}

function Header() {
  return (
    <div className="h-16 flex items-center px-6 border-b border-gray-200 text-2xl font-bold">
      <span className="text-primary mr-2">Secure</span>
      Store
    </div>
  );
}

function Navigation({ rows }) {
  return (
    <nav className="flex-1 px-3 py-4">
      <ul className="space-y-1">
        {rows.map((row, index) => (
          <li key={index}>
            <Link
              to={row.to}
              className="
                  w-full flex items-center gap-3 px-4 py-2 rounded-md
                  font-medium text-gray-600
                  hover:bg-primary hover:text-white
                  transition-colors cursor-pointer mb-3
                "
            >
              {/* Updated Wrapper */}
              <span className="w-5 h-5 flex items-center justify-center">
                {row.icon}
              </span>
              <span>{row.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function LogoutButton({ logout }) {
  return (
    <div className="p-4 border-t border-gray-200">
      <button
        onClick={logout}
        className="
            w-full flex items-center justify-center gap-2
            px-4 py-2 rounded-md font-medium
            text-red-600 hover:bg-red-50
            transition-colors cursor-pointer
          "
      >
        Logout <LogOut size={16} />
      </button>
    </div>
  );
}
