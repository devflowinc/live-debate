import { AiOutlineDown, AiOutlinePlus, AiOutlineUp } from "solid-icons/ai";
import { Accessor, For, createSignal, Show } from "solid-js";
import { TopicValue } from "./types";

export interface ValueSplitButtonProps {
  selectedTopic: Accessor<number>;
  setSelectedTopic: (topic: number) => void;
  topicValues: Accessor<TopicValue[]>;
  showCreateValueForm: Accessor<boolean>;
  setShowCreateValueForm: (show: boolean) => void;
}

const ValueSplitButton = (props: ValueSplitButtonProps) => {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <div class="relative h-fit rounded border border-purple-500 bg-transparent text-xl">
      <table class="h-fit table-auto items-center text-purple-500">
        <thead>
          <tr>
            <th class="w-fit border-r border-purple-500 px-2 font-normal">
              {props.topicValues().length > props.selectedTopic()
                ? props.topicValues()[props.selectedTopic()].name
                : "No values exist"}
            </th>
            <th
              class="h-full border-r border-purple-500 px-2 hover:cursor-pointer"
              onClick={() =>
                props.topicValues().length > 1 && setIsOpen(!isOpen())
              }
            >
              {isOpen() || props.topicValues().length <= 1 ? (
                <AiOutlineUp />
              ) : (
                <AiOutlineDown />
              )}
            </th>
            <th
              class="border-purple-500 px-2 hover:cursor-pointer"
              onClick={() => props.setShowCreateValueForm(true)}
            >
              <AiOutlinePlus />
            </th>
          </tr>
        </thead>
      </table>
      <Show when={isOpen() && props.topicValues().length > 1}>
        <div class="absolute left-0 z-10 mt-1 w-full origin-top-left rounded-lg bg-gray-800 py-2">
          <div class="flex flex-col space-y-1">
            <For each={props.topicValues()}>
              {(value, index) => (
                <div
                  classList={{
                    "text-purple-500 rounded px-2 hover:cursor-pointer hover:bg-gray-700":
                      true,
                    "bg-gray-700 text-purple-500":
                      props.topicValues()[props.selectedTopic()].name ===
                      value.name,
                    "text-purple-400":
                      props.topicValues()[props.selectedTopic()].name !==
                      value.name,
                  }}
                  onClick={() => {
                    props.setSelectedTopic(index());
                    setIsOpen(false);
                  }}
                >
                  {value.name}
                </div>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default ValueSplitButton;
