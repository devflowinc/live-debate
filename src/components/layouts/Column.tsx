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

  return (
    <div
      classList={{
        "flex flex-col space-y-2": true,
        "w-[46%]": props.visible,
        "w-[2%] hover:cursor-pointer": !props.visible,
      }}
    >
      <div class="flex w-full flex-row justify-center">
        <span
          classList={{ "text-xl text-white": true, invisible: !props.visible }}
        >
          {props.visible ? props.columnTitle : "a"}
        </span>
      </div>
      <div onClick={onCloseClickFunction} classList={props.classList}>
        <div class="h-full overflow-y-auto p-3 scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700">
          {props.visible && props.children}
        </div>
      </div>
    </div>
  );
};
