import { For } from "solid-js";
import { CWI, Statement } from "./types";
import { VsReply, VsEye } from "solid-icons/vs";
interface StatementCWIViewProps {
  statement: Statement;
  onWarrantRebuttalClick: () => void;
  onImpactRebuttalClick: () => void;
}

export const StatementCWIView = (props: StatementCWIViewProps) => {
  return (
    <div class="flex flex-col space-y-2 rounded-md border-2 border-indigo-500/75 p-2 text-white">
      <For each={Object.keys(props.statement.statementCWI)}>
        {(key) => {
          return (
            <div class="flex w-full flex-col space-y-2">
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
            </div>
          );
        }}
      </For>
      <div class="flex flex-row space-x-2">
        <button
          type="button"
          class="h-fit rounded-full border border-yellow-500 p-1 text-yellow-500"
          onClick={() => {
            const rebuttalGroupToScroll = document.getElementById(
              `rebuttalgroup-${props.statement.event.id ?? ""}`,
            );
            if (rebuttalGroupToScroll) {
              rebuttalGroupToScroll.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
              });
            }

            const counterArgumentGroupToScroll = document.getElementById(`
              counterargumentgroup-${props.statement.event.id ?? ""}
            `);
            if (counterArgumentGroupToScroll) {
              counterArgumentGroupToScroll.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
              });
            }
          }}
        >
          <VsEye />
        </button>
      </div>
    </div>
  );
};
