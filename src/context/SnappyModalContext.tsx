import { createContext, useEffect, useMemo } from "react";
import { useSnappyModalState } from "./useSnappyModalState";
import { SnappyModal, SnappyModalOptions } from "../SnappyModal";

const SnappyModalContext = createContext({});

export const SnappyModalProvider = ({ children }) => {
  const snappyModal = useSnappyModalState();

  useEffect(() => {
    if (!snappyModal.isShow) return;

    const htmlElement = document.getElementsByTagName("html")[0];
    const pageX = window.scrollX;
    const pageY = window.scrollY;
    htmlElement.style.top = `-${pageY}px`;
    htmlElement.style.left = `-${pageX}px`;
    htmlElement.classList.add("not-scroll");

    return () => {
      htmlElement.style.top = "";
      htmlElement.style.left = "";
      htmlElement.classList.remove("not-scroll");
      window.scrollTo({
        left: pageX,
        top: pageY,
      });
    };
  }, [snappyModal.isShow]);

  const modalRendered = useMemo(() => {
    if (!snappyModal.isShow) return null;
    const { modalProgress } = snappyModal;
    return (
      <div
        id={"snappy-modal-area"}
        {...assignModalOptions(modalProgress.options)}
      >
        <div id={"snappy-modal-content"}>
          <modalProgress.component />
        </div>
      </div>
    );
  }, [snappyModal]);

  return (
    <SnappyModalContext.Provider value={{}}>
      {children}
      {modalRendered}
    </SnappyModalContext.Provider>
  );
};

export function assignModalOptions(options: SnappyModalOptions) {
  const domOptions = {
    classList: [],
    styleProperty: {},
    onClick: e => {},
  };
  if (options.backdrop) {
    domOptions.classList.push("backdrop");
    if (typeof options.backdrop === "string") {
      domOptions.styleProperty["--snappy-modal-backdrop"] = options.backdrop;
    }
  }
  if (options.position) {
    domOptions.styleProperty["--snappy-modal-content-position"] =
      options.position;
  }
  if (options?.allowOutsideClick) {
    domOptions.onClick = e => {
      e.stopPropagation();
      SnappyModal.close();
    };
  }
  if (options.zIndex !== undefined) {
    domOptions.styleProperty["--snappy-modal-z-index"] =
      options.zIndex.toString();
  }
  return {
    className: domOptions.classList.join(" "),
    style: domOptions.styleProperty,
    onClick: domOptions.onClick,
  };
}
