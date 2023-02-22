import { createSignal } from "solid-js";
import { Statement } from "./types";
import InputRowsForm from "~/components/Atoms/InputRowsForm";
import { Topic } from "../Topics/types";
import { Event } from "nostr-tools";

interface CreateStatementFormProps {
  topic: Topic;
  previousEvent: Event;
  type: "aff" | "neg";
  setShowStatementForm: (show: boolean) => void;
  onCreateStatment: (statement: Statement) => void;
}

export const CreateStatementForm = (props: CreateStatementFormProps) => {
  const [statement, setStatement] = createSignal("");
  console.log("CreateStatementForm", props);
  const onCreateStatement = () => {
    props.onCreateStatment({
      topic: props.topic,
      previousEvent: props.previousEvent,
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
