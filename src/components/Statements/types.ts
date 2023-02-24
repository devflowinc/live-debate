import { Topic } from "../Topics/types";
import { Event } from "nostr-tools";

export interface Statement {
  statement: string;
  topic: Topic;
  event: Event;
  previousEventId: string;
  type: "aff" | "neg";
}
