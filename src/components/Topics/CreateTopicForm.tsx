import { createSignal } from "solid-js";

export interface CreateTopicFormProps {
  onCreateTopic: (topic: string) => void;
  onCancel: () => void;
}

const CreateTopicForm = (props: CreateTopicFormProps) => {
  const [topicQuestion, setTopicQuestion] = createSignal<string>("");

  return (
    <div class="w-full rounded-lg border border-white px-2 py-2 text-white">
      <div class="flex flex-col space-y-4">
        <div class="flex flex-col space-y-1">
          <div>Topic Question:</div>
          <input
            class="rounded border border-white bg-slate-900 px-2 text-white"
            type="text"
            onInput={(e) => setTopicQuestion(e.currentTarget.value)}
            value={topicQuestion()}
          />
        </div>
        <div class="mt-2 flex w-full justify-end space-x-2">
          <button
            class="w-fit rounded-full border border-red-500 bg-transparent px-2 text-red-500"
            onClick={props.onCancel}
          >
            Cancel
          </button>
          <button
            class="w-fit rounded-full border border-green-500 bg-transparent px-2 text-green-500"
            onClick={() => props.onCreateTopic(topicQuestion())}
          >
            Create Topic
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTopicForm;
