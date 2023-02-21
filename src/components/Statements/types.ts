export interface Statement {
  statement: string;
  topicId: string;
  previousEvent: string;
  type: "aff" | "neg";
}
