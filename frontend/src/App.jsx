import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Login from "./pages/Login";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import NotFound from "./pages/NotFound";
import { FaSpinner } from "react-icons/fa";

export default function App() {
  const { user, checkingAuth } = useContext(AppContext);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen">
      {user && <Sidebar />}
      <main className="h-screen overflow-auto flex-1">
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Login />} />
          <Route path="/login" element={user ? <Dashboard /> : <Login />} />
          <Route path="/history" element={user ? <History /> : <Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
