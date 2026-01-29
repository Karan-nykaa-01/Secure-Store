import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppProvider>
      <App />
    </AppProvider>
    <Toaster />
  </BrowserRouter>,
);
