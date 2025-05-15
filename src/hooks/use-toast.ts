
import * as React from "react";
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";

export type ToastData = Omit<ToastProps, "id"> & {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

export const TOAST_REMOVE_DELAY = 3000;

type ToasterToast = ToastData & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: string;
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, action.toast],
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // Toast is no longer controlled, remove it from state
      if (toastId === undefined) {
        return {
          ...state,
          toasts: state.toasts.map((t) => ({
            ...t,
            open: false,
          })),
        };
      }

      // Find the toast
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }

    case "REMOVE_TOAST": {
      const { toastId } = action;

      if (toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== toastId),
      };
    }
  }
};

const useToast = () => {
  const [state, dispatch] = React.useReducer(reducer, {
    toasts: [],
  });

  React.useEffect(() => {
    const handleDismiss = (toastId: string) => {
      dispatch({ type: "DISMISS_TOAST", toastId });

      const timeout = setTimeout(() => {
        dispatch({ type: "REMOVE_TOAST", toastId });
      }, TOAST_REMOVE_DELAY);

      toastTimeouts.set(toastId, timeout);
    };

    state.toasts.forEach((toast) => {
      if (toast.open === false && !toastTimeouts.has(toast.id)) {
        handleDismiss(toast.id);
      }
    });

    return () => {
      toastTimeouts.forEach((timeout) => clearTimeout(timeout));
      toastTimeouts.clear();
    };
  }, [state.toasts]);

  const toast = React.useCallback((props: ToastData) => {
    const id = props.id || genId();
    const update = state.toasts.find((toast) => toast.id === id);

    if (update) {
      dispatch({
        type: "UPDATE_TOAST",
        toast: { ...props, id },
      });
      return id;
    }

    dispatch({
      type: "ADD_TOAST",
      toast: {
        ...props,
        id,
        open: true,
      },
    });

    return id;
  }, [state.toasts]);

  return {
    toast,
    toasts: state.toasts,
    dismiss: React.useCallback((toastId?: string) => {
      dispatch({ type: "DISMISS_TOAST", toastId });
    }, []),
  };
};

export { useToast, type ToasterToast };

// Export toast function for easier usage
export const toast = (props: ToastData) => {
  const { toast: toastFn } = useToast();
  return toastFn(props);
};
