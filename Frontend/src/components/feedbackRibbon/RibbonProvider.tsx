import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type RibbonType = "success" | "error";

interface RibbonState {
  type: RibbonType;
  message: string;
  id: number;
}

interface RibbonContextValue {
  showRibbon: (
    type: RibbonState,
    message: string,
    autoDismissMs?: number,
  ) => void;
  clearRibbon: () => void;
}

const RibbonContext = createContext<RibbonContextValue | null>(null);

export function RibbonProvider({ children }: { children: ReactNode }) {
  const [ribbon, setRibbon] = useState<RibbonState | null>(null);
  const timeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearRibbon() {
    useCallback(() => setRibbon(null), []);
  }

  function showRibbon() {
    useCallback((type: RibbonType, message: string, autoDismissMS = 0) => {
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }

      setRibbon({ type, message, id: Date.now() });

      if (autoDismissMS > 0) {
        timeRef.current = setTimeout(() => setRibbon(null), autoDismissMS);
      }
    }, []);
  }

  useEffect(() => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }
  }, []);

  return (
    <RibbonContext.Provider value={{ showRibbon, clearRibbon }}>
      {children}
    </RibbonContext.Provider>
  );
}
