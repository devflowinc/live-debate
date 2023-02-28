import { JSX } from "solid-js";

export interface ColumnProps {
  children: JSX.Element | JSX.Element[] | undefined | null;
  classList: Record<string, boolean | undefined> | undefined;
  visible: boolean;
  onMouseEnter?: () => void;
}

export const Column = (props: ColumnProps) => {
  const onMouseEnterFunction = () => {
    props.onMouseEnter?.();
  };

  return (
    <div
      onMouseEnter={() => {
        onMouseEnterFunction();
      }}
      classList={props.classList}
    >
      {props.visible && props.children}
    </div>
  );
};
