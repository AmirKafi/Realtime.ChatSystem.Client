import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/ui/theme-provider.tsx";
import { ModeToggle } from "./components/ui/mode-toggle.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <div className="absolute top-0 left-0 m-4 text-white px-4 py-2 rounded">
        <ModeToggle />
      </div>
    <StrictMode>
      <App />
      <Toaster/>
    </StrictMode>
  </ThemeProvider>
);
