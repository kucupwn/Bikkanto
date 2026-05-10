import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { RibbonProvider } from "./components/feedbackRibbon/RibbonProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <RibbonProvider>
        <App />
      </RibbonProvider>
    </BrowserRouter>
  </StrictMode>,
);
