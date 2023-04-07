import { JSX } from "solid-js";

export interface ColumnProps {
  children: JSX.Element | JSX.Element[] | undefined | null;
  classList: Record<string, boolean | undefined> | undefined;
  visible: boolean;
  columnTitle?: string;
  onClosedClick?: () => void;
}

export const Column = (props: ColumnProps) => {
  const onCloseClickFunction = () => {
    if (props.visible) return;
    props.onClosedClick?.();
  };

  const windowUnderMd = window.innerWidth < 768;

  return (
    <div
      classList={{
        "flex flex-col space-y-2 w-full": true,
        "md:w-[48%]": props.visible,
        "md:w-[2%] md:hover:cursor-pointer": !props.visible,
      }}
    >
      <div class="flex w-full flex-row justify-center">
        <span
          classList={{
            "text-xl text-indigo-700 dark:text-white": true,
            "md:invisible": !props.visible,
          }}
        >
          {props.visible || windowUnderMd ? props.columnTitle : "a"}
        </span>
      </div>
      <div onClick={onCloseClickFunction} classList={props.classList}>
        <div class="h-full overflow-y-auto p-3 scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700">
          {(props.visible || windowUnderMd) && props.children}
        </div>
      </div>
    </div>
  );
};
