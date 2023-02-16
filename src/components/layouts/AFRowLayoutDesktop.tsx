import { createSignal } from "solid-js";

interface AFRowLayoutDesktopProps {
  topicId: string;
  viewMode: "aff" | "neg";
}

export const AFRowLayoutDesktop = (props: AFRowLayoutDesktopProps) => {
  const [expandedColumns, setExpandedColumns] = createSignal<number[]>([0, 1]);

  const getClassNamesList = (index: number) => {
    const primaryColor =
      props.viewMode === "aff" ? "border-emerald-500" : "border-rose-500";
    const secondaryColor =
      props.viewMode !== "aff" ? "border-emerald-500" : "border-rose-500";

    const color = index == 1 ? secondaryColor : primaryColor;
    const defaults = `border-4 h-[60vh] rounded-xl ${color}`;

    return {
      [defaults]: true,
      "w-[46%]": expandedColumns().includes(index),
      "w-[2%]": !expandedColumns().includes(index),
    };
  };

  const toggleColumn = (index: number) => {
    const expandedColumnsCopy = [...expandedColumns()];
    if (!expandedColumnsCopy.includes(index)) {
      setExpandedColumns((prevExpandedCols) => [
        ...prevExpandedCols.slice(1),
        index,
      ]);
    }
  };

  return (
    <div class="flex w-full space-x-2 px-10">
      <div
        onMouseEnter={() => toggleColumn(0)}
        classList={getClassNamesList(0)}
      />
      <div
        onMouseEnter={() => toggleColumn(1)}
        classList={getClassNamesList(1)}
      />
      <div
        onMouseEnter={() => toggleColumn(2)}
        classList={getClassNamesList(2)}
      />
      <div
        onMouseEnter={() => toggleColumn(3)}
        classList={getClassNamesList(3)}
      />
    </div>
  );
};
