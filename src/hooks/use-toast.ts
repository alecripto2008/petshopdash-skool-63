
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";
import {
  useToast as useToastOriginal,
  toast as toastOriginal
} from "@/components/ui/toaster";

export type ToasterToast = Toast & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variants?: any;
};

export { useToastOriginal as useToast, toastOriginal as toast };
