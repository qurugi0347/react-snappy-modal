import React from "react";
import ReactDOM from "react-dom/client";
import "./SnappyModal.css";
import { SnappyModalExternalStore } from "./context/useSnappyModalState";

let currentComponent: ModalProgress | undefined;
export class SnappyModal {
  static isShow() {
    return !!currentComponent;
  }

  static getModalProcess() {
    return currentComponent;
  }

  static close(value?: any) {
    currentComponent?.resolve(value);
    currentComponent = undefined;
    SnappyModalExternalStore.emitChange();
  }

  static throw(thrower?: any) {
    currentComponent?.throw(thrower);
    currentComponent = undefined;
    SnappyModalExternalStore.emitChange();
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
      currentComponent = {
        component: () => <React.Fragment>{component}</React.Fragment>,
        options: dialogOptions,
        resolve: (value: any) => {
          resolve(value);
          SnappyModalExternalStore.emitChange();
        },
        throw: (thrower: any) => {
          reject(thrower);
          SnappyModalExternalStore.emitChange();
        },
      };
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
};
