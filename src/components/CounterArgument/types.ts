import { Topic } from "../Topics/types";
import { Event } from "nostr-tools";

export interface CounterArgumentContent {
  description: string;
}

export interface CreateCounterArgumentParams {
  counterArgumentContent: CounterArgumentContent;
  previousEvent: Event;
}

export interface CounterArgument {
  counterArgumentContent: CounterArgumentContent;
  topic: Topic;
  event: Event;
  previousEventId: string;
  type: "aff" | "neg";
}
