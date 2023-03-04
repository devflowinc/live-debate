import { comboboxItem } from "../Atoms/Combobox";
import { Topic } from "../Topics/types";
import { Event } from "nostr-tools";

export interface RebuttalContent {
  counterWarrants?: comboboxItem[];
  description: string;
}

export interface CreateRebuttalParams {
  rebuttalContent: RebuttalContent;
  previousEvent: Event;
}

export const implementsRebuttalContent = (
  arg: unknown,
): arg is RebuttalContent => {
  return (
    typeof arg === "object" &&
    arg !== null &&
    "description" in arg &&
    typeof (arg as RebuttalContent).description === "string" &&
    ("counterWarrant" in arg
      ? Array.isArray((arg as RebuttalContent).counterWarrants)
      : true)
  );
};

export interface Rebuttal {
  rebuttalContent: RebuttalContent;
  topic: Topic;
  event: Event;
  originalStatementEventId: string;
  type: "aff" | "neg";
}
