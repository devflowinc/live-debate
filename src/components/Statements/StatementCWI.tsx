import { For } from "solid-js";
import { Statement } from "./types";
import { VsReply, VsEye } from "solid-icons/vs";
import { scrollElementsIntoView } from "../layouts/ScrollRelevantElementsIntoView";
interface StatementCWIViewProps {
  statement: Statement;
  onWarrantRebuttalClick: () => void;
  onImpactRebuttalClick: () => void;
}

export const StatementCWIView = (props: StatementCWIViewProps) => {
  return (
    <div
      class="flex flex-col space-y-2 rounded-md border-2 border-indigo-500/75 p-2 text-white"
      id={`statement-${props.statement.event.id ?? ""}`}
    >
      <div class="flex w-full flex-col space-y-2">
        <div class="grid grid-cols-[18px_1fr] gap-y-2">
          <div class="font-bold text-blue-500">C</div>
          <div class="flex w-full flex-row items-center justify-between space-x-2 text-blue-500">
            <span>{props.statement.statementCWI.claim}</span>
          </div>

          <div class="font-bold text-orange-500">W</div>
          <div class="flex flex-row justify-between">
            <div class="flex w-full flex-row space-x-2 text-orange-500">
              <For each={props.statement.statementCWI.warrants}>
                {(warrant) => {
                  return (
                    <a
                      href={warrant.link}
                      target="_blank"
                      rel="noreferrer"
                      class="underline"
                    >
                      {warrant.name}
                    </a>
                  );
                }}
              </For>
            </div>

            <button
              type="button"
              onClick={() => props.onWarrantRebuttalClick()}
              aria-label="Create Warrant Rebuttal"
              class="h-fit rounded-full border border-orange-500 p-1 text-orange-500"
            >
              <VsReply />
            </button>
          </div>

          <div class="font-bold text-fuchsia-500">I</div>
          <div class="flex w-full flex-row items-center justify-between space-x-2 text-fuchsia-500">
            <span>{props.statement.statementCWI.impact}</span>
            <button
              type="button"
              onClick={() => props.onImpactRebuttalClick()}
              aria-label="Create Impact Rebuttal"
              class="h-fit rounded-full border border-fuchsia-500 p-1"
            >
              <VsReply />
            </button>
          </div>
        </div>
      </div>
      <div class="flex flex-row space-x-2">
        <button
          type="button"
          class="h-fit rounded-full border border-yellow-500 p-1 text-yellow-500"
          onClick={() => {
            scrollElementsIntoView({
              statementId: props.statement.event.id ?? "",
              typesToScrollIntoView: ["rebuttal", "counterargument"],
            });
          }}
        >
          <VsEye />
        </button>
      </div>
    </div>
  );
};
