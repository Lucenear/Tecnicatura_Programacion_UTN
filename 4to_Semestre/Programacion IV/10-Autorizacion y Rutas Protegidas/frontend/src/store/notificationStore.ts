import { create } from "zustand"

export type NotificationType = "success" | "error" | "info"

interface NotificationState {
  message: string
  visible: boolean
  type: NotificationType
  showNotification: (message: string, type?: NotificationType) => void
  hideNotification: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  message: "",
  visible: false,
  type: "info",
  showNotification: (message: string, type: NotificationType = "info") =>
    set({ message, visible: true, type }),
  hideNotification: () =>
    set({ visible: false, message: "" }),
}))
