import { RebuttalContent } from "../Rebuttals/types";
import { Topic } from "../Topics/types";
import { Event } from "nostr-tools";

export type CounterArgumentContent = RebuttalContent;

export interface CreateCounterArgumentParams {
  counterArgumentContent: CounterArgumentContent;
}

export interface CounterArgument {
  counterArgumentContent: CounterArgumentContent;
  topic: Topic;
  event: Event;
  previousEventId: string;
  type: "aff" | "neg";
}

export const implementsCounterArgumentContent = (
  obj: unknown,
): obj is CounterArgumentContent => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "description" in obj &&
    typeof (obj as CounterArgumentContent).description === "string"
  );
};
