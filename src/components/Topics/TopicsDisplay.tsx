import { createSignal } from "solid-js";
import CreateTopicForm from "./CreateTopicForm";
import TopicsList from "./TopicsList";

const TopicsDisplay = () => {
  const [showCreateTopicForm, setShowCreateTopicForm] = createSignal(false);

  const onCancel = () => {
    setShowCreateTopicForm(false);
  };
  const onCreateTopic = (topic: string) => {};

  return (
    <div class="w-full max-w-[75%] flex flex-col space-y-6 border border-slate-600 py-2 rounded-lg justify-center items-center">
      <div class="w-full flex space-x-3 items-center justify-center py-2 border-b border-slate-700">
        <div class="text-2xl font-bold text-white w-fit">Your Topics</div>
        {!showCreateTopicForm() && (
          <button
            class="bg-transparent border border-green-500 rounded-full text-green-500 w-fit px-2"
            onClick={() => {
              setShowCreateTopicForm(true);
            }}
          >
            +
          </button>
        )}
      </div>
      {showCreateTopicForm() && (
        <div class="w-full px-4">
          <CreateTopicForm onCreateTopic={onCreateTopic} onCancel={onCancel} />
        </div>
      )}
      <TopicsList />
    </div>
  );
};

export default TopicsDisplay;
