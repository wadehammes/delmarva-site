"use client";

import { Toast } from "@base-ui/react/toast";
import type { PropsWithChildrenOnly } from "src/@types/react";
import styles from "src/components/Toast/ToastHost.module.css";
import {
  APP_TOAST_LIMIT,
  APP_TOAST_TIMEOUT_MS,
  appToastManager,
} from "src/lib/toast/appToast";

const ToastList = () => {
  const { toasts } = Toast.useToastManager();

  return toasts.map((toastItem) => (
    <Toast.Root
      className={styles.toast}
      key={toastItem.id}
      swipeDirection={["down", "right"]}
      toast={toastItem}
    >
      <Toast.Content className={styles.content}>
        <Toast.Title className={styles.title} />
        <Toast.Close aria-label="Close notification" className={styles.close} />
      </Toast.Content>
    </Toast.Root>
  ));
};

export const ToastHost = ({ children }: PropsWithChildrenOnly) => (
  <Toast.Provider
    limit={APP_TOAST_LIMIT}
    timeout={APP_TOAST_TIMEOUT_MS}
    toastManager={appToastManager}
  >
    {children}
    <Toast.Portal>
      <Toast.Viewport className={styles.viewport}>
        <ToastList />
      </Toast.Viewport>
    </Toast.Portal>
  </Toast.Provider>
);
