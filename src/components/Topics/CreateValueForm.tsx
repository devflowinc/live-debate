import { createSignal } from "solid-js";
import InputRowsForm from "../Atoms/InputRowsForm";
import { TopicValue } from "./types";

export interface CreateValueFormProps {
  onCreateValue: ({ name, description }: TopicValue) => void;
  onCancel: () => void;
}

const CreateValueForm = (props: CreateValueFormProps) => {
  const [valueName, setValueName] = createSignal<string>("");
  const [valueDescription, setValueDescription] = createSignal<string>("");

  const onCreateValueHandler = () => {
    props.onCreateValue({
      name: valueName(),
      description: valueDescription(),
    });
  };

  return (
    <InputRowsForm
      inputGroups={[
        {
          label: "Value Name",
          inputValue: valueName,
          setInputValue: setValueName,
        },
        {
          label: "Value Description",
          inputValue: valueDescription,
          setInputValue: setValueDescription,
        },
      ]}
      createButtonText="Create Value"
      onCreate={onCreateValueHandler}
      onCancel={props.onCancel}
    />
  );
};

export default CreateValueForm;
