import { createContext, useContext } from "react";
import { SnappyModal } from "../SnappyModal";

interface CurrentModalContextType {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  layer: number;
  modalId: string;
}

const CurrentModalContext = createContext<CurrentModalContextType | null>(null);

export const CurrentModalProvider = ({
  children,
  resolve,
  reject,
  layer,
  modalId,
}: {
  children: React.ReactNode;
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  layer: number;
  modalId: string;
}) => {
  return (
    <CurrentModalContext.Provider value={{ resolve, reject, layer, modalId }}>
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
      SnappyModal.removeModalProcess(context.modalId);
    },
    rejectModal: (error?: any) => {
      context.reject(error);
      SnappyModal.removeModalProcess(context.modalId);
    },
    layer: context.layer,
    modalId: context.modalId,
  };
};
