import ApplicationLayout from "~/components/layouts/ApplicationLayout";
import Sidebar from "~/components/Navbar/Sidebar";

export default function DebateHome() {
  return (
    <div class="relative min-h-screen w-screen bg-pink-50 overflow-x-hidden dark:bg-black">
      <Sidebar />

      <div class="flex flex-col justify-center w-full h-full">
        Hi there john
      </div>
    </div>
  );
}
