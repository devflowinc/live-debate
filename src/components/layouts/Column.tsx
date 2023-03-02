import { JSX } from "solid-js";

export interface ColumnProps {
  children: JSX.Element | JSX.Element[] | undefined | null;
  classList: Record<string, boolean | undefined> | undefined;
  visible: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const Column = (props: ColumnProps) => {
  const onMouseEnterFunction = () => {
    props.onMouseEnter?.();
  };
  const onMouseLeaveFunction = () => {
    props.onMouseLeave?.();
  };

  return (
    <div
      onMouseEnter={() => {
        onMouseEnterFunction();
      }}
      onMouseLeave={() => {
        onMouseLeaveFunction();
      }}
      classList={props.classList}
    >
      <div class="overflow-y-auto p-3 scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700">
        {props.visible && props.children}
      </div>
    </div>
  );
};
