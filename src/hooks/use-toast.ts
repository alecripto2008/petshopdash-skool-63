
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";
import { useToast as useToastHook } from "@/components/ui/use-toast";

export type ToastData = Omit<ToastProps, "id"> & {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

export const useToast = () => {
  const { toast } = useToastHook();
  
  return {
    toast: (props: ToastData) => toast(props),
  };
};

export { toast } from "@/components/ui/use-toast";
