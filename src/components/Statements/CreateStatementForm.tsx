import { Accessor, createEffect, createSignal, useContext } from "solid-js";
import InputRowsForm from "~/components/Atoms/InputRowsForm";
import { Event } from "nostr-tools";
import { CWI } from "./types";
import { Combobox, comboboxItem } from "../Atoms/Combobox";
import { CreateWarrantForm } from "../Warrants/CreateWarrantFormWithButton";
import { CreateWarrantParams } from "../Warrants/types";
import { GlobalContext } from "~/contexts/GlobalContext";

interface CreateStatementFormProps {
  previousEvent: Event | null | undefined;
  type: "aff" | "neg";
  setShowStatementForm: (show: boolean) => void;
  onCreateStatmentCWI: ({
    statementCWI,
    type,
  }: {
    statementCWI: CWI;
    type: "aff" | "neg";
  }) => void;
  onCreateWarrant: ({ warrantContent }: CreateWarrantParams) => void;
  warrantOptions: Accessor<comboboxItem[]>;
}

export const CreateStatementForm = (props: CreateStatementFormProps) => {
  const globalContext = useContext(GlobalContext);
  const [getStatementClaim, setStatementClaim] = createSignal("");
  const [getStatementWarrant, setStatementWarrant] = createSignal("");
  const [getStatementImpact, setStatementImpact] = createSignal("");
  const [creating, setCreating] = createSignal(false);

  createEffect(() => {
    if (!creating()) return;
    if (
      !getStatementClaim() ||
      !getStatementWarrant() ||
      !getStatementImpact()
    ) {
      globalContext.createToast({
        type: "error",
        message: "Please fill out all fields",
      });
      setCreating(false);
      return;
    }
    props.onCreateStatmentCWI({
      statementCWI: {
        claim: getStatementClaim(),
        warrant: getStatementWarrant(),
        impact: getStatementImpact(),
      },
      type: props.type,
    });
  });

  const onCancel = () => {
    props.setShowStatementForm(false);
  };

  return (
    <div>
      {!props.previousEvent ? (
        <div />
      ) : (
        <InputRowsForm
          inputGroups={[
            {
              label: "Claim",
              inputValue: getStatementClaim,
              setInputValue: setStatementClaim,
            },
            {
              label: "Warrant",
              inputValue: getStatementWarrant,
              setInputValue: setStatementWarrant,
              component: (
                <Combobox
                  options={props.warrantOptions}
                  aboveOptionsElement={
                    <CreateWarrantForm
                      onCreateWarrant={props.onCreateWarrant}
                    />
                  }
                />
              ),
            },
            {
              label: "Impact",
              inputValue: getStatementImpact,
              setInputValue: setStatementImpact,
              type: "textarea",
            },
          ]}
          createButtonText="Create Statement"
          onCreate={() => setCreating(true)}
          onCancel={onCancel}
        />
      )}
    </div>
  );
};
