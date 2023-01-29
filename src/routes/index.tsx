import { useContext } from "solid-js";
import ApplicationLayout from "~/components/layouts/ApplicationLayout";
import TopicsDisplay from "~/components/Topics/TopicsDisplay";

export default function Home() {
  return (
    <ApplicationLayout>
      <div class="px-8 mt-4 flex w-full justify-center">
        <TopicsDisplay />
      </div>
    </ApplicationLayout>
  );
}
