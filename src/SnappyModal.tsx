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
    modalArea.classList.add("backdrop");
    if (options?.allowOutsideClick) {
      modalArea.onclick = e => {
        e.stopPropagation();
        this.close();
      };
    }
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
    this.removeModalArea();
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

    return new Promise(resolve => {
      currentComponent = {
        component,
        resolve: (value: any) => {
          this.removeModalArea();
          resolve(value);
        },
      };
    });
  }
}

interface ModalProgress {
  component: React.ReactElement;
  resolve: (value: any) => void;
}

const defaultDialogOptions: SnappyModalOptions = {
  allowOutsideClick: true,
  allowScroll: false,
};

export type SnappyModalOptions = {
  allowOutsideClick?: boolean;
  allowScroll?: boolean;
};
