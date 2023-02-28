import { Event } from "nostr-tools";
import { Accessor, createSignal } from "solid-js";
import InputRowsForm from "../Atoms/InputRowsForm";

export interface CreateWarrantRebuttalFormProps {
  previousEvent: Accessor<Event | undefined>;
  onCancel: () => void;
}

export const CreateWarrantRebuttalForm = (
  props: CreateWarrantRebuttalFormProps,
) => {
  const [getCounterWarrant, setCounterWarrant] = createSignal("");
  const [getDescription, setDescription] = createSignal("");

  return (
    <div>
      {props.previousEvent() ? (
        <InputRowsForm
          createButtonText="Create Warrant Rebuttal"
          inputGroups={[
            {
              label: "Counter Warrant",
              inputValue: getCounterWarrant,
              setInputValue: setCounterWarrant,
            },
            {
              label: "Description",
              inputValue: getDescription,
              setInputValue: setDescription,
              type: "textarea",
            },
          ]}
          onCreate={() => null}
          onCancel={props.onCancel}
          borderColor="border-orange-500"
        />
      ) : (
        <div />
      )}
    </div>
  );
};
