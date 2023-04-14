import { A } from "solid-start";
import { ImStack } from "solid-icons/im";
import { TiTimes } from "solid-icons/ti";
import { AiOutlineCheck } from "solid-icons/ai";
import ThemeModeController from "./ThemeModeController";
import { BiRegularLogOut, BiRegularMenuAltLeft } from "solid-icons/bi";
import { createSignal, For, Show } from "solid-js";
import { FiHelpCircle } from "solid-icons/fi";

export interface TopicProps {
  name: string;
  resolved: boolean;
}

export default function Sidebar() {
  const [open, setOpen] = createSignal(false);
  const toggle = () => setOpen((open) => !open);

  const [topics, setTopics] = createSignal<TopicProps[]>([
    { name: "Topic 1", resolved: false },
    { name: "Topic 2", resolved: true },
  ]);

  return (
    <div>
      <Show when={open()}>
        <div class="absolute z-50 h-screen w-7/12 rounded-md bg-pink-50">
          <div class="flex h-full flex-col">
            <div class="flex items-center space-x-4 rounded-tr-md border-b-2 bg-gray-400 px-3 py-1">
              <div class="text-3xl">
                <ImStack />
              </div>
              <div>New Topic</div>
            </div>
            <For each={topics()}>
              {(topic) => (
                <div class="flex items-center space-x-4 border-b-2 px-3 py-1">
                  <div class="text-3xl">
                    {topic.resolved ? <AiOutlineCheck /> : <TiTimes />}
                  </div>
                  <div>{topic.name}</div>
                </div>
              )}
            </For>
            <div class="flex-1" />
            <div class="flex items-center space-x-4 border-b-2 bg-gray-400 px-3 py-1">
              <div class="text-3xl">
                <FiHelpCircle />
              </div>
              <div>Help</div>
            </div>
            <div class="flex items-center space-x-4 rounded-br-md border-b-2 bg-gray-400 px-3 py-1">
              <div class="text-3xl">
                <BiRegularLogOut />
              </div>
              <div>Log out</div>
            </div>
          </div>
        </div>
      </Show>
      <div class="flex w-full items-center border-b border-gray-800 bg-transparent p-4 md:px-16">
        <BiRegularMenuAltLeft
          onClick={toggle}
          class="text-5xl text-gray-400 dark:text-white"
        />
        <div class="p-2" />
        <A href="/" class="text-2xl text-black dark:text-white">
          Arguflow
        </A>
        <div class="flex-grow" />
        <div class="flex items-center space-x-4">
          <ThemeModeController />{" "}
        </div>
      </div>
    </div>
  );
}
