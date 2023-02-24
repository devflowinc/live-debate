import { Event } from "nostr-tools";

export interface Topic {
  title: string;
  event: Event;
}

export interface TopicValue {
  name: string;
  description: string;
  event?: Event;
}

export interface ValueWithTopicEventId extends TopicValue {
  event: Event;
}
