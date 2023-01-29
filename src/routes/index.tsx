import ApplicationLayout from "~/components/layouts/ApplicationLayout";
import TopicsDisplay from "~/components/Topics/TopicsDisplay";

export default function Home() {
  return (
    <ApplicationLayout>
      <div class="mt-4 flex w-full justify-center px-8">
        <TopicsDisplay />
      </div>
    </ApplicationLayout>
  );
}
