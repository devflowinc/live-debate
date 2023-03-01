import { Event } from "nostr-tools";
import { Accessor, createEffect, createSignal, useContext } from "solid-js";
import InputRowsForm from "../Atoms/InputRowsForm";
import { CreateRebuttalParams } from "./types";
import { GlobalContext } from "~/contexts/GlobalContext";

export interface CreateWarrantRebuttalFormProps {
  previousEvent: Accessor<Event | undefined>;
  onCancel: () => void;
  onCreateWarrantRebuttal: ({
    previousEvent,
    rebuttalContent,
  }: CreateRebuttalParams) => void;
}

export const CreateWarrantRebuttalForm = (
  props: CreateWarrantRebuttalFormProps,
) => {
  const globalContext = useContext(GlobalContext);
  const [getCounterWarrant, setCounterWarrant] = createSignal("");
  const [getDescription, setDescription] = createSignal("");
  const [creating, setCreating] = createSignal(false);

  createEffect(() => {
    if (!creating()) return;
    if (getDescription() === "" || getCounterWarrant() === "") {
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
    props.onCreateWarrantRebuttal({
      rebuttalContent: {
        counterWarrant: getCounterWarrant(),
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
          onCreate={() => setCreating(true)}
          onCancel={props.onCancel}
          borderColor="border-orange-500"
        />
      ) : (
        <div />
      )}
    </div>
  );
};
