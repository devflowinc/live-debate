import { createSignal } from "solid-js";

export interface CreateTopicFormProps {
  onCreateTopic: (topic: string) => void;
  onCancel: () => void;
}

const CreateTopicForm = (props: CreateTopicFormProps) => {
  const [topicQuestion, setTopicQuestion] = createSignal<string>("");

  return (
    <div class="w-full px-2 text-white border border-white rounded-lg py-2">
      <div class="flex flex-col space-y-4">
        <div class="flex flex-col space-y-1">
          <div>Topic Question:</div>
          <input
            class="border border-white rounded bg-slate-900 text-white px-2"
            type="text"
            onInput={(e) => setTopicQuestion(e.currentTarget.value)}
            value={topicQuestion()}
          />
        </div>
        <div class="flex w-full justify-end space-x-2 mt-2">
          <button
            class="bg-transparent border border-red-500 rounded-full text-red-500 w-fit px-2"
            onClick={props.onCancel}
          >
            Cancel
          </button>
          <button
            class="bg-transparent border border-green-500 rounded-full text-green-500 w-fit px-2"
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
