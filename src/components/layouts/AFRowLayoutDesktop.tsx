import { AiOutlinePlus } from "solid-icons/ai";
import { createSignal, For } from "solid-js";
import { CreateStatementForm } from "../Statements/CreateStatementForm";
import { Statement } from "../Statements/types";

interface AFRowLayoutDesktopProps {
  topicId: string;
  viewMode: "aff" | "neg";
}

interface StatementViewProps {
  statement: Statement;
  visible: boolean;
}

export const StatementView = (props: StatementViewProps) => {
  return (
    <div
      classList={{
        "border-2 border-purple-500 rounded-md py-3 px-4 text-white": true,
        "w-full px-0 py-0 text-center": !props.visible,
        "min-w-lg": props.visible,
      }}
    >
      {props.visible && props.statement.statement}
    </div>
  );
};

export const AFRowLayoutDesktop = (props: AFRowLayoutDesktopProps) => {
  const [expandedColumns, setExpandedColumns] = createSignal<number[]>([0, 1]);
  const [showStatementForm, setShowStatementForm] = createSignal(false);

  const [openingStatements, setOpeningStatements] = createSignal<Statement[]>([
    {
      topicId: props.topicId,
      previousEvent: "",
      statement: "Opening Statement 1",
      type: "aff",
    },
    {
      topicId: props.topicId,
      previousEvent: "",
      statement: "Opening Statement 2",
      type: "aff",
    },
  ]);

  const getClassNamesList = (index: number) => {
    const primaryColor =
      props.viewMode === "aff" ? "border-emerald-500" : "border-rose-500";
    const secondaryColor =
      props.viewMode !== "aff" ? "border-emerald-500" : "border-rose-500";

    const color = index == 1 ? secondaryColor : primaryColor;
    const defaults = `border-4 h-[60vh] rounded-xl ${color}`;

    return {
      [defaults]: true,
      "w-[46%] flex flex-col space-y-5 p-5": expandedColumns().includes(index),
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

  const onCreateStatment = (statement: Statement) => {};

  return (
    <div>
      <div class="flex max-w-[40%] items-center justify-center">
        <div
          onClick={() => setShowStatementForm(true)}
          class="flex cursor-pointer items-center space-x-2 border border-purple-500 px-4 py-3 text-white"
        >
          <AiOutlinePlus />
          <div>Add Opening Statement</div>
        </div>
      </div>
      {showStatementForm() && (
        <CreateStatementForm
          topicId={props.topicId}
          type={props.viewMode}
          setShowStatementForm={setShowStatementForm}
          onCreateStatment={onCreateStatment}
        />
      )}
      <div class="flex w-full space-x-2 px-10">
        <div
          onMouseEnter={() => toggleColumn(0)}
          classList={getClassNamesList(0)}
        >
          <For each={openingStatements()}>
            {(statement) => (
              <StatementView
                statement={statement}
                visible={expandedColumns().includes(0)}
              />
            )}
          </For>
        </div>
        <div
          onMouseEnter={() => toggleColumn(1)}
          classList={getClassNamesList(1)}
        ></div>
        <div
          onMouseEnter={() => toggleColumn(2)}
          classList={getClassNamesList(2)}
        ></div>
        <div
          onMouseEnter={() => toggleColumn(3)}
          classList={getClassNamesList(3)}
        ></div>
      </div>
    </div>
  );
};
