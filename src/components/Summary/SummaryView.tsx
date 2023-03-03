import { VsEye } from "solid-icons/vs";
import { scrollElementsIntoView } from "../layouts/ScrollRelevantElementsIntoView";
import { Summary } from "./types";

export interface SummaryViewProps {
  summary: Summary;
}

export const SummaryView = (props: SummaryViewProps) => {
  return (
    <div class="flex w-full flex-col space-y-2 rounded-md border-2 border-indigo-500 p-2 text-white">
      <div class="grid grid-cols-[18px_1fr]">
        <div class="font-bold">D</div>
        <div>
          <span>{props.summary.summaryContent.description}</span>
        </div>
      </div>
      <button
        type="button"
        class="h-fit w-fit rounded-full border border-yellow-500 p-1 text-yellow-500"
        onClick={() => {
          scrollElementsIntoView({
            statementId: props.summary.originalStatementEventId,
            typesToScrollIntoView: ["statement", "rebuttal", "counterargument"],
          });
        }}
      >
        <VsEye />
      </button>
    </div>
  );
};
