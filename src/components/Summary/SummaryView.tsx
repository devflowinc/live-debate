import { ScrollRelevantElementsIntoViewButton } from "../layouts/ScrollRelevantElementsIntoView";
import { CgProfile } from "solid-icons/cg";
import { Summary } from "./types";

export interface SummaryViewProps {
  summary: Summary;
  highlighted?: boolean;
}

export const SummaryView = (props: SummaryViewProps) => {
  return (
    <div
      classList={{
        "flex w-full flex-col space-y-2 rounded-md border-2 border-indigo-500 p-2 text-white":
          true,
        "bg-neutral-900": props.highlighted,
      }}
    >
      <div class="grid grid-cols-[18px_1fr]">
        <div class="font-bold">D</div>
        <div>
          <span>{props.summary.summaryContent.description}</span>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <ScrollRelevantElementsIntoViewButton
          statementId={props.summary.originalStatementEventId}
          typesToScrollIntoView={["statement", "rebuttal", "counterargument"]}
        />
        <div class="flex items-center space-x-1">
          <CgProfile />
          <p>
            {props.summary.event.pubkey.slice(0, 3)}...
            {props.summary.event.pubkey.slice(-3)}
          </p>
        </div>
      </div>
    </div>
  );
};
