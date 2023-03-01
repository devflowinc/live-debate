import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  useContext,
} from "solid-js";
import { Event } from "nostr-tools";
import InputRowsForm from "../Atoms/InputRowsForm";
import { CreateCounterArgumentParams } from "./types";
import { GlobalContext } from "~/contexts/GlobalContext";
import { implementsRebuttalContent } from "../Rebuttals/types";

export interface CreateCounterArgumentFormProps {
  previousEvent: Accessor<Event | undefined>;
  onCancel: () => void;
  onCreateCounterArgument: ({
    counterArgumentContent,
  }: CreateCounterArgumentParams) => void;
}

export const CreateCounterArgumentForm = (
  props: CreateCounterArgumentFormProps,
) => {
  const globalContext = useContext(GlobalContext);
  const [getCounterWarrant, setCounterWarrant] = createSignal("");
  const [getDescription, setDescription] = createSignal("");
  const [creating, setCreating] = createSignal(false);

  const warrantOrImpact = createMemo((): "warrant" | "impact" => {
    const previousEvent = props.previousEvent();
    if (!previousEvent) return "impact";
    const previousEventContent = previousEvent.content;
    if (implementsRebuttalContent(previousEventContent)) {
      return previousEventContent.counterWarrant ? "warrant" : "impact";
    }
    return "impact";
  });

  createEffect(() => {
    if (!creating()) return;
    if (
      getDescription() === "" ||
      (warrantOrImpact() === "warrant" && getCounterWarrant() === "")
    ) {
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
        counterWarrant: getCounterWarrant(),
        description: getDescription(),
      },
    });
    setCreating(false);
  });

  return (
    <div>
      {props.previousEvent() ? (
        warrantOrImpact() === "warrant" ? (
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
          <InputRowsForm
            createButtonText="Create Warrant CounterArgument"
            inputGroups={[
              {
                label: "Counter Warrant",
                inputValue: getCounterWarrant,
                setInputValue: setCounterWarrant,
                type: "textarea",
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
          />
        )
      ) : (
        <div />
      )}
    </div>
  );
};
