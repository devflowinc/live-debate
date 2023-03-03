import { Topic } from "../Topics/types";
import { Event } from "nostr-tools";

export interface SummaryContent {
  description: string;
}

export interface CreateSummaryParams {
  summaryContent: SummaryContent;
}

export const implementsSummaryContent = (
  arg: unknown,
): arg is SummaryContent => {
  return (
    typeof arg === "object" &&
    arg !== null &&
    "description" in arg &&
    typeof (arg as SummaryContent).description === "string"
  );
};

export interface Summary {
  summaryContent: SummaryContent;
  topic: Topic;
  event: Event;
  originalStatementEventId: string;
  type: "aff" | "neg";
}
