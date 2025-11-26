import React from "react";
import ReactDOM from "react-dom/client";
import "./SnappyModal.css";
import { SnappyModalExternalStore } from "./context/useSnappyModalState";
import { CurrentModalProvider } from "./context/CurrentModalContext";

function isModalId(layerOrId: number | string): boolean {
  const asNumber = Number(layerOrId);
  return isNaN(asNumber);
}

const currentComponents: ModalProgress[] = [];
export class SnappyModal {
  static isShow() {
    return currentComponents.length > 0;
  }

  static getCurrentComponent(layerOrId: number | string) {
    if (isModalId(layerOrId)) {
      return currentComponents.find(c => c.modalId === layerOrId);
    }
    return currentComponents.find(c => c.options.layer === Number(layerOrId));
  }

  static removeModalProcess(layerOrId: number | string) {
    const index = isModalId(layerOrId)
      ? currentComponents.findIndex(c => c.modalId === layerOrId)
      : currentComponents.findIndex(c => c.options.layer === Number(layerOrId));
    if (index === -1) return;
    currentComponents.splice(index, 1);
    SnappyModalExternalStore.emitChange();
  }

  static getModalProcess() {
    return currentComponents;
  }

  static close(value?: any, layerOrId: number | string = 0) {
    const currentComponent = this.getCurrentComponent(layerOrId);
    currentComponent?.resolve(value);
    this.removeModalProcess(layerOrId);
  }

  static throw(thrower?: any, layerOrId: number | string = 0) {
    const currentComponent = this.getCurrentComponent(layerOrId);
    currentComponent?.throw(thrower);
    this.removeModalProcess(layerOrId);
  }

  static show(
    component: React.ReactElement,
    options?: SnappyModalOptions,
  ): Promise<any> {
    const dialogOptions = {
      ...defaultDialogOptions,
      ...options,
    };

    const modalId = crypto.randomUUID();

    return new Promise((resolve, reject) => {
      currentComponents.push({
        modalId,
        component: ({ resolveFunc, rejectFunc, layer, modalId }) => (
          <CurrentModalProvider
            resolve={resolveFunc}
            reject={rejectFunc}
            layer={layer}
            modalId={modalId}
          >
            {component}
          </CurrentModalProvider>
        ),
        options: dialogOptions,
        resolve: (value: any) => {
          resolve(value);
          SnappyModalExternalStore.emitChange();
        },
        throw: (thrower: any) => {
          reject(thrower);
          SnappyModalExternalStore.emitChange();
        },
      });
      currentComponents.sort((a, b) => a.options.layer - b.options.layer);
      SnappyModalExternalStore.emitChange();
    });
  }
}

export interface ModalProgress {
  modalId: string;
  component: React.FC<any>;
  options: SnappyModalOptions;
  resolve: (value?: any) => void;
  throw: (thrower?: any) => void;
}

const defaultDialogOptions: SnappyModalOptions = {
  allowOutsideClick: true,
  allowScroll: false,
  backdrop: true,
  position: "center",
  layer: 0,
};

type SnappyModalPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type SnappyModalOptions = {
  allowOutsideClick?: boolean;
  allowScroll?: boolean;
  backdrop?: boolean | string;
  position?: SnappyModalPosition;
  zIndex?: number;
  layer?: number;
  className?: string;
  style?: React.CSSProperties;
};
