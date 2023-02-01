import { createSignal } from "solid-js";
import InputRowsForm from "../Atoms/InputRowsForm";

export interface CreateTopicFormProps {
  onCreateTopic: (topic: string) => void;
  onCancel: () => void;
}

const CreateTopicForm = (props: CreateTopicFormProps) => {
  const [topicQuestion, setTopicQuestion] = createSignal<string>("");

  const onCreateTopicValue = () => {
    props.onCreateTopic(topicQuestion());
  };

  return (
    <InputRowsForm
      inputGroups={[
        {
          label: "Topic Question",
          inputValue: topicQuestion,
          setInputValue: setTopicQuestion,
        },
      ]}
      createButtonText="Create Topic"
      onCreate={onCreateTopicValue}
      onCancel={props.onCancel}
    />
  );
};

export default CreateTopicForm;
