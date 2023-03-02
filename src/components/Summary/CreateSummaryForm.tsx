import { Accessor, createEffect, createSignal, useContext } from "solid-js";
import { Event } from "nostr-tools";
import { CreateSummaryParams } from "./types";
import { GlobalContext } from "~/contexts/GlobalContext";
import InputRowsForm from "../Atoms/InputRowsForm";

export interface CreateSummaryFormProps {
  previousEvent: Accessor<Event | undefined>;
  onCancel: () => void;
  onCreateSummary: ({ summaryContent }: CreateSummaryParams) => void;
}

export const CreateSummaryForm = (props: CreateSummaryFormProps) => {
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
    props.onCreateSummary({
      summaryContent: {
        description: getDescription(),
      },
    });
    setDescription("");
    setCreating(false);
  });

  return (
    <div>
      <InputRowsForm
        createButtonText="Create Summary"
        inputGroups={[
          {
            label: "Summary",
            inputValue: getDescription,
            setInputValue: setDescription,
            type: "textarea",
          },
        ]}
        onCreate={() => setCreating(true)}
        onCancel={props.onCancel}
      />
    </div>
  );
};
