import React from "react";
import ReactDOM from "react-dom/client";
import "./SnappyModal.css";
import { SnappyModalExternalStore } from "./context/useSnappyModalState";
import { CurrentModalProvider } from "./context/CurrentModalContext";

const currentComponents: ModalProgress[] = [];
export class SnappyModal {
  static isShow() {
    return currentComponents.length > 0;
  }

  static getCurrentComponent(layer: number) {
    return currentComponents.find(c => c.options.layer === layer);
  }

  static removeModalProcess(layer: number) {
    const index = currentComponents.findIndex(c => c.options.layer === layer);
    if (index === -1) return;
    currentComponents.splice(index, 1);
    SnappyModalExternalStore.emitChange();
  }

  static getModalProcess() {
    return currentComponents;
  }

  static close(value?: any, layer = 0) {
    const currentComponent = this.getCurrentComponent(layer);
    currentComponent?.resolve(value);
    this.removeModalProcess(layer);
  }

  static throw(thrower?: any, layer = 0) {
    const currentComponent = this.getCurrentComponent(layer);
    currentComponent?.throw(thrower);
    this.removeModalProcess(layer);
    currentComponent?.throw(thrower);
  }

  static show(
    component: React.ReactElement,
    options?: SnappyModalOptions,
  ): Promise<any> {
    const dialogOptions = {
      ...defaultDialogOptions,
      ...options,
    };

    return new Promise((resolve, reject) => {
      currentComponents.push({
        component: ({ resolveFunc, rejectFunc, layer }) => (
          <CurrentModalProvider
            resolve={resolveFunc}
            reject={rejectFunc}
            layer={layer}
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
