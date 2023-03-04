import { JSX } from "solid-js";

export interface ColumnProps {
  children: JSX.Element | JSX.Element[] | undefined | null;
  classList: Record<string, boolean | undefined> | undefined;
  visible: boolean;
  onClosedClick?: () => void;
}

export const Column = (props: ColumnProps) => {
  const onCloseClickFunction = () => {
    if (props.visible) return;
    props.onClosedClick?.();
  };

  return (
    <div onClick={onCloseClickFunction} classList={props.classList}>
      <div class="h-full overflow-y-auto p-3 scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700">
        {props.visible && props.children}
      </div>
    </div>
  );
};
