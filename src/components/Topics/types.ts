export interface Topic {
  eventId: string;
  title: string;
}

export interface TopicValue {
  name: string;
  description: string;
}

export interface ValueWithTopicEventId extends TopicValue {
  topicEventId: string;
}
