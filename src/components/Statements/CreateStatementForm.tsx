import { Accessor, createSignal } from "solid-js";
import InputRowsForm from "~/components/Atoms/InputRowsForm";
import { Topic } from "../Topics/types";
import { Event } from "nostr-tools";

interface CreateStatementFormProps {
  topic: Accessor<Topic | null>;
  previousEvent: Event;
  type: "aff" | "neg";
  setShowStatementForm: (show: boolean) => void;
  onCreateStatment: ({
    statement,
    type,
  }: {
    statement: string;
    type: "aff" | "neg";
  }) => void;
}

export const CreateStatementForm = (props: CreateStatementFormProps) => {
  const [statement, setStatement] = createSignal("");
  console.log("CreateStatementForm", props);
  const onCreateStatement = () => {
    props.onCreateStatment({
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
