
import * as React from "react";

export interface ToastData {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}

export interface ToasterToast extends ToastData {
  id: string;
  dismiss: () => void;
}

const TOAST_LIMIT = 10;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterType = {
  toasts: ToasterToast[];
  toast: (data: ToastData) => void;
  dismiss: (toastId: string) => void;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
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
      toastId: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId: string;
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
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
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
      
      // First set the dismiss state
      const newState = {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId ? { ...t, open: false } : t
        ),
      };
      
      if (toastTimeouts.has(toastId)) {
        clearTimeout(toastTimeouts.get(toastId));
        toastTimeouts.delete(toastId);
      }
      
      return newState;
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };

    default:
      return state;
  }
};

export const useToast = () => {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] });
  
  React.useEffect(() => {
    return () => {
      for (const timeout of toastTimeouts.values()) {
        clearTimeout(timeout);
      }
    };
  }, []);

  const toast = React.useCallback(
    (data: ToastData) => {
      const id = genId();

      const dismissToast = () => {
        dispatch({ type: "DISMISS_TOAST", toastId: id });
        
        const timeout = setTimeout(() => {
          dispatch({ type: "REMOVE_TOAST", toastId: id });
        }, TOAST_REMOVE_DELAY);
        
        toastTimeouts.set(id, timeout);
      };

      const newToast = {
        ...data,
        id,
        dismiss: dismissToast,
      };

      dispatch({ type: "ADD_TOAST", toast: newToast });
      
      return id;
    },
    [dispatch]
  );

  const dismiss = React.useCallback((toastId: string) => {
    dispatch({ type: "DISMISS_TOAST", toastId });
  }, []);

  return {
    toasts: state.toasts,
    toast,
    dismiss,
  } as ToasterType;
};

// Export the toast function directly
export const toast = (data: ToastData) => {
  const toastInstance = getToastInstance();
  if (toastInstance) {
    return toastInstance.toast(data);
  }
  return null;
};

// Singleton pattern para o toast
let toastInstance: ToasterType | null = null;

const getToastInstance = (): ToasterType | null => {
  return toastInstance;
};

export const setToastInstance = (instance: ToasterType) => {
  toastInstance = instance;
};
