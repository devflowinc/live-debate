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

export interface Rebuttal {
  counterWarrant?: string;
  description: string;
}

export interface CreateRebuttalParams {
  rebuttal: Rebuttal;
  previousEvent: Event;
}
