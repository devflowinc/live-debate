import { useParams } from "solid-start";
import ApplicationLayout from "~/components/layouts/ApplicationLayout";

const TopicDetail = () => {
  const params = useParams<{ id: string }>();

  return (
    <ApplicationLayout>
      <h1 class="w-full text-center text-white">Topic Detail</h1>
    </ApplicationLayout>
  );
};

export default TopicDetail;
