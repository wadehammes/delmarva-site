import { Toast } from "@base-ui/react/toast";

export const APP_TOAST_LIMIT = 3;
export const APP_TOAST_TIMEOUT_MS = 5_000;

export const appToastManager = Toast.createToastManager();

type AppToastOptions = {
  id?: string;
};

type AppToastType = "error" | "success" | "warning";

const showAppToast = (
  type: AppToastType,
  message: string,
  options?: AppToastOptions,
) =>
  appToastManager.add({
    id: options?.id,
    priority: type === "error" ? "high" : "low",
    title: message,
    type,
  });

export const appToast = {
  error: (message: string, options?: AppToastOptions) =>
    showAppToast("error", message, options),
  success: (message: string, options?: AppToastOptions) =>
    showAppToast("success", message, options),
  warning: (message: string, options?: AppToastOptions) =>
    showAppToast("warning", message, options),
};
