import { A } from "solid-start";
import ApplicationLayout from "~/components/layouts/ApplicationLayout";

export default function NotFound() {
  return (
    <ApplicationLayout>
      <div class="mt-4 flex h-1/2 w-full items-center justify-center px-8">
        <div class="w-fit max-w-[75%] text-center text-2xl text-white">
          Page not found.{" "}
          <A href="/" class="text-blue-500 underline">
            Go back to home
          </A>
        </div>
      </div>
    </ApplicationLayout>
  );
}
