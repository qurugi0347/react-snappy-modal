import { createContext, useContext } from "react";
import { SnappyModal } from "../SnappyModal";

interface CurrentModalContextType {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  layer: number;
}

const CurrentModalContext = createContext<CurrentModalContextType | null>(null);

export const CurrentModalProvider = ({
  children,
  resolve,
  reject,
  layer,
}: {
  children: React.ReactNode;
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  layer: number;
}) => {
  return (
    <CurrentModalContext.Provider value={{ resolve, reject, layer }}>
      {children}
    </CurrentModalContext.Provider>
  );
};

export const useCurrentModal = () => {
  const context = useContext(CurrentModalContext);
  if (!context) {
    throw new Error("useCurrentModal must be used within CurrentModalProvider");
  }
  return {
    resolveModal: (value?: any) => {
      context.resolve(value);
      SnappyModal.removeModalProcess(context.layer);
    },
    rejectModal: (error?: any) => {
      context.reject(error);
      SnappyModal.removeModalProcess(context.layer);
    },
    layer: context.layer,
  };
};
