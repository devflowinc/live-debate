import { CounterArgument } from "./types";
import { ScrollRelevantElementsIntoViewButton } from "../layouts/ScrollRelevantElementsIntoView";
import { AiOutlineFunnelPlot } from "solid-icons/ai";
import { For, createMemo } from "solid-js";
import NostrUserName from "../Atoms/NostrUserName";

export interface CounterArgumentViewProps {
  originalStatementId: string;
  counterArgument: CounterArgument;
  onSummaryClick: () => void;
  highlighted?: boolean;
}

export const CounterArgumentView = (props: CounterArgumentViewProps) => {
  const viewMode = createMemo(() => {
    const counterWarrantsExist =
      props.counterArgument.counterArgumentContent.counterWarrants &&
      props.counterArgument.counterArgumentContent.counterWarrants.length > 0;
    return counterWarrantsExist ? "warrant" : "description";
  });

  return (
    <div
      classList={{
        "flex flex-col space-y-2 rounded-md border-2 p-2 text-black dark:text-white": true,
        "border-orange-500": viewMode() === "warrant",
        "border-fuchsia-500": viewMode() === "description",
        "bg-blue-100 dark:bg-neutral-900": props.highlighted,
      }}
    >
      <div class="flex w-full flex-row items-center justify-between space-x-2">
        <div class="grid grid-cols-[24px_1fr]">
          {viewMode() === "warrant" && (
            <>
              <div class="font-bold text-orange-500">W</div>
              <div class="flex w-full flex-row items-center justify-between space-x-2 text-orange-500">
                <For
                  each={
                    props.counterArgument.counterArgumentContent.counterWarrants
                  }
                >
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
            </>
          )}
          <div class="font-bold">D</div>
          <div class="flex w-full flex-row items-center justify-between space-x-2">
            <span>
              {props.counterArgument.counterArgumentContent.description}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => props.onSummaryClick()}
          aria-label="Create Summary"
          class="h-fit self-center rounded-full border p-1"
        >
          <AiOutlineFunnelPlot />
        </button>
      </div>
      <div class="flex items-center justify-between">
        <ScrollRelevantElementsIntoViewButton
          statementId={props.originalStatementId}
          typesToScrollIntoView={["statement", "rebuttal", "summary"]}
        />

        <NostrUserName pubkey={props.counterArgument.event.pubkey} />
      </div>
    </div>
  );
};
