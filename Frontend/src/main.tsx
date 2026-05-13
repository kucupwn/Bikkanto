import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { RibbonProvider } from "./components/feedbackRibbon/RibbonProvider.tsx";
import { ThemeProvider } from "./components/ThemeProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <RibbonProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </RibbonProvider>
    </BrowserRouter>
  </StrictMode>,
);
