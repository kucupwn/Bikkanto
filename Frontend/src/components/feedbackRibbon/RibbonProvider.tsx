import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { FeedbackRibbon, type RibbonType } from "./FeedbackRibbon";

interface RibbonState {
  type: RibbonType;
  message: string;
  id: number;
}

interface RibbonContextValue {
  showRibbon: (
    type: RibbonType,
    message: string,
    autoDismissMs?: number,
  ) => void;
}

const RibbonContext = createContext<RibbonContextValue | null>(null);

export function RibbonProvider({ children }: { children: ReactNode }) {
  const [ribbon, setRibbon] = useState<RibbonState | null>(null);
  const timeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showRibbon = useCallback(
    (type: RibbonType, message: string, autoDismissMS = 3000) => {
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }

      setRibbon({ type, message, id: Date.now() });

      if (autoDismissMS > 0) {
        timeRef.current = setTimeout(() => setRibbon(null), autoDismissMS);
      }
    },
    [],
  );

  useEffect(() => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }
  }, []);

  return (
    <RibbonContext.Provider value={{ showRibbon }}>
      {children}
      {ribbon && (
        <FeedbackRibbon
          key={ribbon.id}
          type={ribbon?.type}
          message={ribbon?.message}
        />
      )}
    </RibbonContext.Provider>
  );
}

export function useRibbon() {
  const ctx = useContext(RibbonContext);
  if (!ctx) throw new Error("useRibbon must be used inside <RibbonProvider>");
  return ctx;
}
