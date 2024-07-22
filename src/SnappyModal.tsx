import React from "react";
import ReactDOM from "react-dom/client";
import "./SnappyModal.css";

let currentComponent: ModalProgress | undefined;
export class SnappyModal {
  private static makeModalArea(options?: SnappyModalOptions) {
    if (document.getElementById("snappy-modal-area")) {
      return;
    }
    const htmlElement = document.getElementsByTagName("html")[0];
    const pageX = window.scrollX;
    const pageY = window.scrollY;
    htmlElement.style.top = `-${pageY}px`;
    htmlElement.style.left = `-${pageX}px`;
    htmlElement.classList.add("not-scroll");

    const modalArea = document.createElement("div");
    modalArea.id = "snappy-modal-area";
    // options 적용
    assignModalOptions(modalArea, options);
    document.body.appendChild(modalArea);

    const modalContent = document.createElement("div");
    modalContent.id = "snappy-modal-content";
    modalContent.onclick = e => {
      e.stopPropagation();
    };
    modalArea.appendChild(modalContent);
  }

  private static removeModalArea() {
    const modalArea = document.getElementById("snappy-modal-area");
    if (modalArea) {
      document.body.removeChild(modalArea);

      const htmlElement = document.getElementsByTagName("html")[0];
      const scrollY = Number(htmlElement.style.top.replace(/(px|-)/g, ""));
      const scrollX = Number(htmlElement.style.left.replace(/(px|-)/g, ""));
      htmlElement.style.top = "";
      htmlElement.style.left = "";
      htmlElement.classList.remove("not-scroll");
      window.scrollTo({
        left: scrollX,
        top: scrollY,
      });
    }
  }

  static isShow() {
    return !!currentComponent;
  }

  static close(value?: any) {
    currentComponent?.resolve(value);
    currentComponent = undefined;
    SnappyModal?.removeModalArea();
  }

  static throw(thrower?: any) {
    currentComponent?.throw(thrower);
    currentComponent = undefined;
    SnappyModal?.removeModalArea();
  }

  static show(
    component: React.ReactElement,
    options?: SnappyModalOptions,
  ): Promise<any> {
    const dialogOptions = {
      ...defaultDialogOptions,
      ...options,
    };
    this.makeModalArea(dialogOptions);

    const root = ReactDOM.createRoot(
      document.getElementById("snappy-modal-content") as HTMLElement,
    );
    root.render(<React.Fragment>{component}</React.Fragment>);

    return new Promise((resolve, reject) => {
      currentComponent = {
        component,
        resolve: (value: any) => {
          SnappyModal?.removeModalArea();
          resolve(value);
        },
        throw: (thrower: any) => {
          SnappyModal?.removeModalArea();
          reject(thrower);
        },
      };
    });
  }
}

interface ModalProgress {
  component: React.ReactElement;
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

function assignModalOptions(dom: HTMLDivElement, options: SnappyModalOptions) {
  if (options.backdrop) {
    dom.classList.add("backdrop");
    if (typeof options.backdrop === "string") {
      dom.style.setProperty("--snappy-modal-backdrop", options.backdrop);
    }
  }
  if (options.position) {
    dom.style.setProperty("--snappy-modal-content-position", options.position);
  }
  if (options?.allowOutsideClick) {
    dom.onclick = e => {
      e.stopPropagation();
      this.close();
    };
  }
  if (options.zIndex !== undefined) {
    dom.style.setProperty("--snappy-modal-z-index", options.zIndex.toString());
  }
}
