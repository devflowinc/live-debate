import { Topic } from "../Topics/types";
import { Event } from "nostr-tools";

export const implementsCWI = (arg: unknown): arg is CWI => {
  return (
    typeof arg === "object" &&
    arg !== null &&
    "claim" in arg &&
    "warrant" in arg &&
    "impact" in arg &&
    typeof (arg as CWI).claim === "string" &&
    typeof (arg as CWI).warrant === "string" &&
    typeof (arg as CWI).impact === "string"
  );
};

export interface CWI {
  claim: string;
  warrant: string;
  impact: string;
}

export interface Statement {
  statementCWI: CWI;
  topic: Topic;
  event: Event;
  previousEventId: string;
  type: "aff" | "neg";
}

export interface RebuttalContent {
  counterWarrant?: string;
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
      ? typeof (arg as RebuttalContent).counterWarrant === "string"
      : true)
  );
};

export interface Rebuttal {
  rebuttalContent: RebuttalContent;
  topic: Topic;
  event: Event;
  previousEventId: string;
  type: "aff" | "neg";
}
