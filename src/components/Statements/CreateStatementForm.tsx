import { createSignal } from "solid-js";
import { Statement } from "./types";
import InputRowsForm from "~/components/Atoms/InputRowsForm";

interface CreateStatementFormProps {
  topicId: string;
  type: "aff" | "neg";
  setShowStatementForm: (show: boolean) => void;
  onCreateStatment: (statement: Statement) => void;
}

export const CreateStatementForm = (props: CreateStatementFormProps) => {
  const [statement, setStatement] = createSignal("");

  const onCreateStatement = () => {
    props.onCreateStatment({
      topicId: props.topicId,
      previousEvent: "",
      statement: statement(),
      type: props.type,
    });
  };

  const onCancel = () => {
    props.setShowStatementForm(false);
  };

  return (
    <InputRowsForm
      inputGroups={[
        {
          label: "Topic Question",
          inputValue: statement,
          setInputValue: setStatement,
        },
      ]}
      createButtonText="Create Topic"
      onCreate={onCreateStatement}
      onCancel={onCancel}
    />
  );
};
