import { ScrollRelevantElementsIntoViewButton } from "../layouts/ScrollRelevantElementsIntoView";
import { Summary } from "./types";
import NostrUserName from "../Atoms/NostrUserName";

export interface SummaryViewProps {
  summary: Summary;
  highlighted?: boolean;
}

export const SummaryView = (props: SummaryViewProps) => {
  return (
    <div
      classList={{
        "flex w-full flex-col space-y-2 rounded-md border-2 border-indigo-500 p-2 text-black dark:text-white":
          true,
        "bg-blue-100 dark:bg-neutral-900": props.highlighted,
      }}
    >
      <div class="grid grid-cols-[24px_1fr]">
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
        <NostrUserName pubkey={props.summary.event.pubkey} />
      </div>
    </div>
  );
};
