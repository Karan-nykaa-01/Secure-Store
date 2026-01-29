import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Login from "./pages/Login";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import NotFound from "./pages/NotFound";
import Loader from "./components/Loader";

export default function App() {

  const { user, checkingAuth } = useContext(AppContext);

  // Show loading spinner while checking authentication
  if (checkingAuth) {
    return <Loader message="Checking authentication..." />;
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
