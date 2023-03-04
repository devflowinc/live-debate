import { comboboxItem } from "../Atoms/Combobox";
import { Topic } from "../Topics/types";
import { Event } from "nostr-tools";

export const implementsCWI = (arg: unknown): arg is CWI => {
  return (
    typeof arg === "object" &&
    arg !== null &&
    "claim" in arg &&
    "warrants" in arg &&
    "impact" in arg &&
    typeof (arg as CWI).claim === "string" &&
    Array.isArray((arg as CWI).warrants) &&
    typeof (arg as CWI).impact === "string"
  );
};

export interface CWI {
  claim: string;
  warrants: comboboxItem[];
  impact: string;
}

export interface Statement {
  statementCWI: CWI;
  topic: Topic;
  event: Event;
  previousEventId: string;
  type: "aff" | "neg";
}
