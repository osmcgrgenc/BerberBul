"use client";
import { useEffect } from "react";
import { toast } from "sonner";

interface ToastMessageProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
}

export default function ToastMessage({ type, message }: ToastMessageProps) {
  useEffect(() => {
    if (!message) return;
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      default:
        toast(message);
    }
  }, [type, message]);

  return null;
}
