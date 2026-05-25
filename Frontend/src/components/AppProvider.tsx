import type { ReactNode } from "react";
import { RibbonProvider } from "./feedbackRibbon/RibbonProvider";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./ThemeProvider";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <RibbonProvider>
      <ThemeProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </ThemeProvider>
    </RibbonProvider>
  );
}
