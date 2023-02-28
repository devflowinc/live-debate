import { For } from "solid-js";
import { CWI, Statement } from "./types";
import { VsReply } from "solid-icons/vs";
interface StatementCWIViewProps {
  statement: Statement;
  onWarrantRebuttalClick: () => void;
  onImpactRebuttalClick: () => void;
}

export const StatementCWIView = (props: StatementCWIViewProps) => {
  return (
    <div class="flex flex-col space-y-2 rounded-md border-2 border-indigo-500/75 p-2 text-white">
      {/* loop over the keys of props.statement.statementCWI */}
      <For each={Object.keys(props.statement.statementCWI)}>
        {(key) => {
          return (
            <div class="grid grid-cols-[18px_1fr]">
              <div
                classList={{
                  "font-bold": true,
                  "text-blue-500": key === "claim",
                  "text-orange-500": key === "warrant",
                  "text-fuchsia-500": key === "impact",
                }}
              >
                {key.charAt(0).toUpperCase()}
              </div>
              <div
                classList={{
                  "w-full flex flex-row space-x-2 justify-between items-center":
                    true,
                  "text-blue-500": key === "claim",
                  "text-orange-500": key === "warrant",
                  "text-fuchsia-500": key === "impact",
                }}
              >
                <span>{props.statement.statementCWI[key as keyof CWI]}</span>
                {key !== "claim" && (
                  <button
                    type="button"
                    onClick={
                      key === "warrant"
                        ? props.onWarrantRebuttalClick
                        : props.onImpactRebuttalClick
                    }
                    aria-label="Create Warrant Rebuttal"
                    classList={{
                      "p-1 border rounded-full h-fit": true,
                      "border-orange-500": key === "warrant",
                      "border-fuchsia-500": key === "impact",
                    }}
                  >
                    <VsReply />
                  </button>
                )}
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
};
