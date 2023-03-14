import { For } from "solid-js";
import { Statement } from "./types";
import { VsReply } from "solid-icons/vs";
import { ScrollRelevantElementsIntoViewButton } from "../layouts/ScrollRelevantElementsIntoView";
import NostrUserName from "../Atoms/NostrUserName";

interface StatementCWIViewProps {
  statement: Statement;
  onWarrantRebuttalClick: () => void;
  onImpactRebuttalClick: () => void;
  highlighted?: boolean;
}

export const StatementCWIView = (props: StatementCWIViewProps) => {
  return (
    <div
      classList={{
        "flex flex-col space-y-2 rounded-md border-2 border-indigo-500/75 p-2 text-white":
          true,
        "bg-sky-100 dark:bg-neutral-900": props.highlighted,
      }}
      id={`statement-${props.statement.event.id}`}
    >
      <div class="flex w-full flex-col space-y-2">
        <div class="grid grid-cols-[24px_1fr] gap-y-2">
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
      <div class="flex items-center justify-between">
        <ScrollRelevantElementsIntoViewButton
          statementId={props.statement.event.id}
          typesToScrollIntoView={["rebuttal", "counterargument", "summary"]}
        />
        <NostrUserName pubkey={props.statement.event.pubkey} />
      </div>
    </div>
  );
};
