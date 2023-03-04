import { Topic } from "../Topics/types";
import { Event } from "nostr-tools";

export interface WarrantContent {
  name: string;
  link: string;
}

export interface CreateWarrantParams {
  warrantContent: WarrantContent;
}

export const implementsWarrantContent = (
  arg: unknown,
): arg is WarrantContent => {
  return (
    typeof arg === "object" &&
    arg !== null &&
    "name" in arg &&
    typeof (arg as WarrantContent).name === "string" &&
    "link" in arg &&
    typeof (arg as WarrantContent).link === "string"
  );
};

export interface Warrant {
  warrantContent: WarrantContent;
  topic: Topic;
  event: Event;
}
