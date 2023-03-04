import { GlobalContext } from "~/contexts/GlobalContext";
import { CreateWarrantParams } from "./types";
import { createEffect, createSignal, useContext } from "solid-js";
import InputRowsForm from "../Atoms/InputRowsForm";

export interface CreateWarrantFormProps {
  onCreateWarrant: ({ warrantContent }: CreateWarrantParams) => void;
}

export const CreateWarrantForm = (props: CreateWarrantFormProps) => {
  const globalContext = useContext(GlobalContext);
  const [getName, setName] = createSignal("");
  const [getLink, setLink] = createSignal("");
  const [formOpen, setFormOpen] = createSignal(false);
  const [creating, setCreating] = createSignal(false);

  createEffect(() => {
    if (!creating()) return;
    if (getName() === "" || getLink() === "") {
      globalContext.createToast({
        type: "error",
        message: "Please fill out all fields",
      });
      setCreating(false);
      return;
    }
    props.onCreateWarrant({
      warrantContent: {
        name: getName(),
        link: getLink(),
      },
    });
    setName("");
    setLink("");
    setCreating(false);
    setFormOpen(false);
  });

  return (
    <div class="mb-2 w-full">
      {!formOpen() && (
        <button
          class="afCombobox w-full rounded border border-gray-400 bg-gray-200 py-2 px-4 font-semibold text-gray-800 shadow hover:bg-gray-300"
          onClick={() => setFormOpen(true)}
        >
          Create Warrant
        </button>
      )}
      {formOpen() && (
        <div class="bg-black">
          <InputRowsForm
            createButtonText="Create Warrant"
            inputGroups={[
              {
                label: "Name",
                inputValue: getName,
                setInputValue: setName,
              },
              {
                label: "Link",
                inputValue: getLink,
                setInputValue: setLink,
              },
            ]}
            onCreate={() => {
              setCreating(true);
            }}
            onCancel={() => setFormOpen(false)}
            buttonClass="afCombobox"
          />
        </div>
      )}
    </div>
  );
};
