import { CounterArgumentContent } from "./types";
import { ScrollRelevantElementsIntoViewButton } from "../layouts/ScrollRelevantElementsIntoView";
import { AiOutlineFunnelPlot } from "solid-icons/ai";
import { For } from "solid-js";

export interface CounterArgumentViewProps {
  originalStatementId: string;
  counterArgumentContent: CounterArgumentContent;
  onSummaryClick: () => void;
  highlighted?: boolean;
}

export const CounterArgumentView = (props: CounterArgumentViewProps) => {
  return (
    <div
      classList={{
        "flex flex-col space-y-2 rounded-md border-2 p-2 text-white": true,
        "border-orange-500": !!props.counterArgumentContent.counterWarrants,
        "border-fuchsia-500": !props.counterArgumentContent.counterWarrants,
        "bg-neutral-900": props.highlighted,
      }}
    >
      <div class="flex w-full flex-row items-center justify-between">
        <div class="grid grid-cols-[18px_1fr]">
          {props.counterArgumentContent.counterWarrants && (
            <>
              <div class="font-bold text-orange-500">W</div>
              <div class="flex w-full flex-row items-center justify-between space-x-2 text-orange-500">
                <For each={props.counterArgumentContent.counterWarrants}>
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
            <span>{props.counterArgumentContent.description}</span>
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
      <ScrollRelevantElementsIntoViewButton
        statementId={props.originalStatementId}
        typesToScrollIntoView={["statement", "rebuttal", "summary"]}
      />
    </div>
  );
};
