import { Topic } from "../Topics/types";
import { Event } from "nostr-tools";

export interface Statement {
  statement: string;
  topic: Topic;
  previousEvent: Event;
  type: "aff" | "neg";
}
