import { SnappyModal } from "../SnappyModal";
import { useSyncExternalStore } from "react";

let snappyModalListeners = [];
let snappyModalState = {
  isShow: false,
};

function emitChange() {
  for (const listener of snappyModalListeners) {
    listener();
  }
}

export const SnappyModalExternalStore = {
  emitChange: () => {
    snappyModalState = {
      isShow: SnappyModal.isShow(),
    };
    emitChange();
  },
  subscribe(listener: () => unknown) {
    snappyModalListeners = [...snappyModalListeners, listener];
    return () => {
      snappyModalListeners = snappyModalListeners.filter(l => l !== listener);
    };
  },
  getSnappyModalState() {
    return snappyModalState;
  },
};

export const useSnappyModalState = () => {
  return useSyncExternalStore(
    SnappyModalExternalStore.subscribe,
    SnappyModalExternalStore.getSnappyModalState,
  );
};
