import { GlobalContext } from "~/contexts/GlobalContext";
import { CreateWarrantParams } from "./types";
import { createEffect, createSignal, useContext } from "solid-js";
import InputRowsForm from "../Atoms/InputRowsForm";

export interface CreateWarrantFormProps {
  onCancel: () => void;
  onCreateWarrant: ({ warrantContent }: CreateWarrantParams) => void;
}

export const CreateWarrantForm = (props: CreateWarrantFormProps) => {
  const globalContext = useContext(GlobalContext);
  const [getName, setName] = createSignal("");
  const [getLink, setLink] = createSignal("");
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
  });

  return (
    <div class="w-full">
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
        onCreate={() => setCreating(true)}
        onCancel={props.onCancel}
      />
    </div>
  );
};
