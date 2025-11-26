import React from "react";
import ReactDOM from "react-dom/client";
import "./SnappyModal.css";
import { SnappyModalExternalStore } from "./context/useSnappyModalState";
import { CurrentModalProvider } from "./context/CurrentModalContext";

function generateModalId(): string {
  // Modern browsers with crypto.randomUUID()
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers using crypto.getRandomValues()
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    // Set version (4) and variant bits
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, byte =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  // Final fallback for very old environments
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

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

  static removeModalProcess(
    layerOrId: number | string,
    skipEmitChange = false,
  ) {
    const index = isModalId(layerOrId)
      ? currentComponents.findIndex(c => c.modalId === layerOrId)
      : currentComponents.findIndex(c => c.options.layer === Number(layerOrId));
    if (index === -1) return;
    currentComponents.splice(index, 1);
    if (!skipEmitChange) {
      SnappyModalExternalStore.emitChange();
    }
  }

  static getModalProcess() {
    return currentComponents;
  }

  static close(value?: any, layerOrId: number | string = 0) {
    const currentComponent = this.getCurrentComponent(layerOrId);
    if (!currentComponent) return;

    this.removeModalProcess(layerOrId, true);
    currentComponent.resolve(value);
  }

  static throw(thrower?: any, layerOrId: number | string = 0) {
    const currentComponent = this.getCurrentComponent(layerOrId);
    if (!currentComponent) return;

    this.removeModalProcess(layerOrId, true);
    currentComponent.throw(thrower);
  }

  static show(
    component: React.ReactElement,
    options?: SnappyModalOptions,
  ): Promise<any> {
    const dialogOptions = {
      ...defaultDialogOptions,
      ...options,
    };

    const modalId = generateModalId();

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
