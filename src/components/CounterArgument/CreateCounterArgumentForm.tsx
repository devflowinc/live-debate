import { Accessor, createEffect, createSignal, useContext } from "solid-js";
import { Event } from "nostr-tools";
import InputRowsForm from "../Atoms/InputRowsForm";
import { CreateCounterArgumentParams } from "./types";
import { GlobalContext } from "~/contexts/GlobalContext";

export interface CreateCounterArgumentFormProps {
  previousEvent: Accessor<Event | undefined>;
  onCancel: () => void;
  onCreateCounterArgument: ({
    previousEvent,
    counterArgumentContent,
  }: CreateCounterArgumentParams) => void;
}

export const CreateCounterArgumentForm = (
  props: CreateCounterArgumentFormProps,
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
    props.onCreateCounterArgument({
      counterArgumentContent: {
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
          createButtonText="Create Impact CounterArgument"
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
        />
      ) : (
        <div />
      )}
    </div>
  );
};
