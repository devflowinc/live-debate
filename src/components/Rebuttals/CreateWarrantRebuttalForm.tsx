import { Event } from "nostr-tools";
import { Accessor, createEffect, createSignal, useContext } from "solid-js";
import InputRowsForm from "../Atoms/InputRowsForm";
import { CreateRebuttalParams } from "./types";
import { GlobalContext } from "~/contexts/GlobalContext";
import { Combobox, comboboxItem } from "../Atoms/Combobox";
import { CreateWarrantParams } from "../Warrants/types";
import { CreateWarrantFormWithButton } from "../Warrants/CreateWarrantFormWithButton";

export interface CreateWarrantRebuttalFormProps {
  previousEvent: Accessor<Event | undefined>;
  onCancel: () => void;
  onCreateWarrantRebuttal: ({
    previousEvent,
    rebuttalContent,
  }: CreateRebuttalParams) => void;
  warrantOptions: Accessor<comboboxItem[]>;
  onCreateWarrant: ({ warrantContent }: CreateWarrantParams) => void;
}

export const CreateWarrantRebuttalForm = (
  props: CreateWarrantRebuttalFormProps,
) => {
  const globalContext = useContext(GlobalContext);
  const [selectedComboboxItems, setSelectedComboboxItems] = createSignal<
    comboboxItem[]
  >([]);
  const [getDescription, setDescription] = createSignal("");
  const [creating, setCreating] = createSignal(false);

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
    props.onCreateWarrantRebuttal({
      rebuttalContent: {
        counterWarrants: selectedComboboxItems(),
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
              label: "Counter Warrants",
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
                    <CreateWarrantFormWithButton
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
          borderColor="border-orange-500"
        />
      ) : (
        <div />
      )}
    </div>
  );
};
