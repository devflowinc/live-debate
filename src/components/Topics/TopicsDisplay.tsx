import CreateTopicForm from "./CreateTopicForm";
import TopicsList from "./TopicsList";

const TopicsDisplay = () => {
  const onCancel = () => {};
  const onCreateTopic = (topic: string) => {};

  return (
    <div class="w-full px-2 max-w-[75%] flex flex-col space-y-6">
      <CreateTopicForm onCreateTopic={onCreateTopic} onCancel={onCancel} />
      <TopicsList />
    </div>
  );
};

export default TopicsDisplay;
