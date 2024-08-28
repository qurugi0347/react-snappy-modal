import { SnappyModal } from "../SnappyModal";
import { useSyncExternalStore } from "react";

let snappyModalListeners = [];

function emitChange() {
  for (const listener of snappyModalListeners) {
    listener();
  }
}

export const SnappyModalExternalStore = {
  emitChange,
  subscribe(listener: () => unknown) {
    snappyModalListeners = [...snappyModalListeners, listener];
    return () => {
      snappyModalListeners = snappyModalListeners.filter(l => l !== listener);
    };
  },
  getSnappyModalState() {
    return {
      isShow: SnappyModal.isShow(),
    };
  },
};

export const useSnappyModalState = () => {
  return useSyncExternalStore(
    SnappyModalExternalStore.subscribe,
    SnappyModalExternalStore.getSnappyModalState,
  );
};
