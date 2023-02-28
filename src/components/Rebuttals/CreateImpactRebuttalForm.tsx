import { Accessor, createEffect, createSignal, useContext } from "solid-js";
import { Event } from "nostr-tools";
import InputRowsForm from "../Atoms/InputRowsForm";
import { CreateRebuttalParams } from "../Statements/types";
import { GlobalContext } from "~/contexts/GlobalContext";

export interface CreateImpactRebuttalFormProps {
  previousEvent: Accessor<Event | undefined>;
  onCancel: () => void;
  onCreateImpactRebuttal: ({
    rebuttal,
    previousEvent,
  }: CreateRebuttalParams) => void;
}

export const CreateImpactRebuttalForm = (
  props: CreateImpactRebuttalFormProps,
) => {
  const globalContext = useContext(GlobalContext);
  const [getDescription, setDescription] = createSignal("");
  const [creating, setCreating] = createSignal(false);

  createEffect(() => {
    if (!creating()) return;
    if (getDescription() === "") {
      globalContext.createToast({
        type: "error",
        message: "Please fill out all fields",
      });
      setCreating(false);
      return;
    }
    const previousEvent = props.previousEvent();
    if (!previousEvent) {
      globalContext.createToast({
        type: "error",
        message: "No previous event",
      });
      setCreating(false);
      return;
    }
    props.onCreateImpactRebuttal({
      rebuttal: {
        description: getDescription(),
      },
      previousEvent: previousEvent,
    });
    setCreating(false);
  });

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
          onCreate={() => setCreating(true)}
          onCancel={props.onCancel}
          borderColor="border-fuchsia-500"
        />
      ) : (
        <div />
      )}
    </div>
  );
};
