import { VsEye } from "solid-icons/vs";
import { CounterArgumentContent } from "./types";
import { scrollElementsIntoView } from "../layouts/ScrollRelevantElementsIntoView";
import { AiOutlineFunnelPlot } from "solid-icons/ai";

export interface CounterArgumentViewProps {
  originalStatementId: string;
  counterArgumentContent: CounterArgumentContent;
  onSummaryClick: () => void;
}

export const CounterArgumentView = (props: CounterArgumentViewProps) => {
  return (
    <div
      class={`flex flex-col space-y-2 rounded-md border-2 p-2 text-white ${
        props.counterArgumentContent.counterWarrant
          ? "border-orange-500"
          : "border-fuchsia-500"
      }`}
    >
      <div class="flex w-full flex-row items-center justify-between">
        <div class="grid grid-cols-[18px_1fr]">
          {props.counterArgumentContent.counterWarrant && (
            <>
              <div class="font-bold text-orange-500">W</div>
              <div class="flex w-full flex-row items-center justify-between space-x-2 text-orange-500">
                <span>{props.counterArgumentContent.counterWarrant}</span>
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
      <div class="flex flex-row space-x-2">
        <button
          type="button"
          class="h-fit rounded-full border border-yellow-500 p-1 text-yellow-500"
          onClick={() => {
            scrollElementsIntoView({
              statementId: props.originalStatementId,
              typesToScrollIntoView: ["statement", "rebuttal"],
            });
          }}
        >
          <VsEye />
        </button>
      </div>
    </div>
  );
};
