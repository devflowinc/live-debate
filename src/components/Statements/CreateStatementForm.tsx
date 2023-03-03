import { createSignal } from "solid-js";
import InputRowsForm from "~/components/Atoms/InputRowsForm";
import { Event } from "nostr-tools";
import { CWI } from "./types";
import { Combobox } from "../Atoms/Combobox";

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
}

export const CreateStatementForm = (props: CreateStatementFormProps) => {
  const [getStatementClaim, setStatementClaim] = createSignal("");
  const [getStatementWarrant, setStatementWarrant] = createSignal("");
  const [getStatementImpact, setStatementImpact] = createSignal("");

  const onCreateStatement = () => {
    props.onCreateStatmentCWI({
      statementCWI: {
        claim: getStatementClaim(),
        warrant: getStatementWarrant(),
        impact: getStatementImpact(),
      },
      type: props.type,
    });
  };

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
                  inputValue={getStatementWarrant}
                  setInputValue={setStatementWarrant}
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
          onCreate={onCreateStatement}
          onCancel={onCancel}
        />
      )}
    </div>
  );
};
