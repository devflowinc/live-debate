import { Accessor, createSignal } from "solid-js";
import { Event } from "nostr-tools";
import InputRowsForm from "../Atoms/InputRowsForm";

export interface CreateImpactRebuttalFormProps {
  previousEvent: Accessor<Event | undefined>;
  onCancel: () => void;
}

export const CreateImpactRebuttalForm = (
  props: CreateImpactRebuttalFormProps,
) => {
  const [getDescription, setDescription] = createSignal("");

  return (
    <div>
      {props.previousEvent() ? (
        <InputRowsForm
          createButtonText="Create Impact Rebuttal"
          inputGroups={[
            {
              label: "Description",
              inputValue: getDescription,
              setInputValue: setDescription,
              type: "textarea",
            },
          ]}
          onCreate={() => null}
          onCancel={props.onCancel}
          borderColor="border-fuchsia-500"
        />
      ) : (
        <div />
      )}
    </div>
  );
};
