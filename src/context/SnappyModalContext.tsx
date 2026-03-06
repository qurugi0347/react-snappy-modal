import { createContext, useEffect, useMemo, useRef } from "react";
import { useSnappyModalState } from "./useSnappyModalState";
import { ModalProgress, SnappyModal, SnappyModalOptions } from "../SnappyModal";

const SnappyModalContext = createContext({});

export const SnappyModalProvider = ({ children }) => {
  const snappyModal = useSnappyModalState();

  const shouldBlockScroll = useMemo(() => {
    if (!snappyModal.isShow) return false;
    return snappyModal.modalProgress.some(
      modal => modal.options.allowScroll === false,
    );
  }, [snappyModal.isShow, snappyModal.modalProgress]);

  useEffect(() => {
    if (!shouldBlockScroll) return;

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
  }, [shouldBlockScroll]);

  const modalRendered = useMemo(() => {
    const { modalProgress } = snappyModal;
    return modalProgress.map(modal => (
      <ModalDialog key={modal.modalId} modal={modal} />
    ));
  }, [snappyModal.modalProgress]);

  return (
    <SnappyModalContext.Provider value={{}}>
      {children}
      {modalRendered}
    </SnappyModalContext.Provider>
  );
};

export function assignModalOptions(options: SnappyModalOptions) {
  const classList = ["snappy-modal-area"];
  const styleProperty: Record<string, string> = {};

  if (options.backdrop) {
    styleProperty["--snappy-modal-backdrop-color"] =
      typeof options.backdrop === "string"
        ? options.backdrop
        : "rgba(0,0,0,.5)";
  }
  if (options.position) {
    styleProperty["--snappy-modal-content-position"] = options.position;

    if (options.position.startsWith("top-")) {
      styleProperty["--snappy-modal-align-self"] = "start";
    } else if (options.position.startsWith("bottom-")) {
      styleProperty["--snappy-modal-align-self"] = "end";
    }
  }

  return {
    className: classList.join(" "),
    style: styleProperty,
  };
}

const ModalDialog = ({ modal }: { modal: ModalProgress }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
    return () => {
      if (dialog?.open) {
        dialog.close();
      }
    };
  }, []);

  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (modal.options.allowOutsideClick) {
      SnappyModal.close(undefined, modal.modalId);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current && modal.options.allowOutsideClick) {
      SnappyModal.close(undefined, modal.modalId);
    }
  };

  const { className, style } = assignModalOptions(modal.options);

  return (
    <dialog
      ref={dialogRef}
      className={className}
      style={style}
      onCancel={handleCancel}
      onClick={handleClick}
    >
      <div
        className={`snappy-modal-content ${modal.options.className ? modal.options.className : ""}`}
        style={modal.options.style}
        onClick={e => e.stopPropagation()}
      >
        <modal.component
          resolveFunc={modal.resolve}
          rejectFunc={modal.throw}
          layer={modal.options.layer}
          modalId={modal.modalId}
        />
      </div>
    </dialog>
  );
};
