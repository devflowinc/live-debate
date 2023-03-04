import { Toast, Transition } from "solid-headless";
import { createEffect, createSignal, onCleanup, useContext } from "solid-js";
import { GlobalContext } from "~/contexts/GlobalContext";
import { TiTimes } from "solid-icons/ti";

export type ToastType = "success" | "error";

export interface ToastContent {
  message: string;
  type: ToastType;
}

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
}

export const CustomToast = (props: ToastProps) => {
  const globalContext = useContext(GlobalContext);
  const [isOpen, setIsOpen] = createSignal(true);

  const toasterStore = globalContext.toasterStore;

  function dismiss() {
    setIsOpen(false);
  }

  const removeIdFromToasterStore = () => toasterStore.remove(props.id);

  createEffect(() => {
    const autoCloseTimeout = setTimeout(() => {
      dismiss();
    }, 5000);

    onCleanup(() => {
      clearTimeout(autoCloseTimeout);
    });
  });

  return (
    <Transition
      show={isOpen()}
      class={`relative my-2 rounded-lg ${
        props.type === "error" ? "bg-rose-900" : "bg-green-900"
      } p-4 transition`}
      enter="ease-out duration-300"
      enterFrom="opacity-0 scale-50"
      enterTo="opacity-100 scale-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-50"
      afterLeave={removeIdFromToasterStore}
    >
      <Toast class="flex items-center justify-between">
        <span class="flex-1 text-sm font-semibold text-white">
          {props.message}
        </span>
        <button
          type="button"
          class={`h-6 w-6 flex-none rounded-full ${
            props.type === "error" ? "bg-rose-900" : "bg-green-900"
          }  p-1 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
          onClick={dismiss}
        >
          <TiTimes />
        </button>
      </Toast>
    </Transition>
  );
};
