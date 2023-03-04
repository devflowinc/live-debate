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
import { Combobox, comboboxItem } from "../Atoms/Combobox";
import { CreateWarrantForm } from "../Warrants/CreateWarrantFormWithButton";
import { CreateWarrantParams } from "../Warrants/types";

export interface CreateCounterArgumentFormProps {
  previousEvent: Accessor<Event | undefined>;
  onCancel: () => void;
  onCreateCounterArgument: ({
    counterArgumentContent,
  }: CreateCounterArgumentParams) => void;
  warrantOptions: Accessor<comboboxItem[]>;
  onCreateWarrant: ({ warrantContent }: CreateWarrantParams) => void;
}

export const CreateCounterArgumentForm = (
  props: CreateCounterArgumentFormProps,
) => {
  const globalContext = useContext(GlobalContext);
  const [selectedComboboxItems, setSelectedComboboxItems] = createSignal<
    comboboxItem[]
  >([]);
  const [getDescription, setDescription] = createSignal("");
  const [creating, setCreating] = createSignal(false);

  const warrantOrImpact = createMemo((): "warrant" | "impact" => {
    const previousEvent = props.previousEvent();
    if (!previousEvent) return "impact";
    const previousEventContent = previousEvent.content;
    if (implementsRebuttalContent(previousEventContent)) {
      return previousEventContent.counterWarrants ? "warrant" : "impact";
    }
    return "impact";
  });

  createEffect(() => {
    if (!creating()) return;
    if (getDescription() === "" || !selectedComboboxItems().length) {
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
        counterWarrants: selectedComboboxItems(),
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
                component: (
                  <Combobox
                    options={props.warrantOptions}
                    selected={selectedComboboxItems}
                    onSelect={(option: comboboxItem) => {
                      setSelectedComboboxItems((prev) => {
                        const prevIncludesOption = prev.find((prevOption) => {
                          return prevOption.eventId === option.eventId;
                        });
                        if (!prevIncludesOption) {
                          return [option, ...prev];
                        }
                        return prev.filter(
                          (prevOption) => prevOption.eventId !== option.eventId,
                        );
                      });
                    }}
                    aboveOptionsElement={
                      <CreateWarrantForm
                        onCreateWarrant={props.onCreateWarrant}
                      />
                    }
                  />
                ),
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
