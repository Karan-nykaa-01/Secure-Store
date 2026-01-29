import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Login from "./pages/Login";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import NotFound from "./pages/NotFound";

export default function App() {

  const { user, loading } = useContext(AppContext);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading...</p>
        </div>
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
