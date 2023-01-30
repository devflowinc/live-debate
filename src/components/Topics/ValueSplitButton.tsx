import { AiOutlineDown, AiOutlineUp } from "solid-icons/ai";
import { Accessor, createSignal } from "solid-js";
import { Value } from "./types";

export interface SplitButtonProps {
  selectedTopic: Accessor<number>;
  setSelectedTopic: (topic: number) => void;
  topicValues: Accessor<Value[]>;
}

export const SplitButton = (props: SplitButtonProps) => {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <div class="relative rounded border border-purple-500 bg-transparent text-xl">
      <div class="flex items-center text-purple-500">
        <div class="w-fit border-r border-purple-500 px-2">
          {props.topicValues()[props.selectedTopic()].name}
        </div>
        <div
          class="px-2 hover:cursor-pointer"
          onClick={() => setIsOpen(!isOpen())}
        >
          {isOpen() ? <AiOutlineUp /> : <AiOutlineDown />}
        </div>
      </div>
      {isOpen() && (
        <div class="absolute left-0 z-10 mt-1 w-full origin-top-left rounded-lg bg-gray-800 py-2">
          <div class="flex flex-col space-y-1">
            {props.topicValues().map((value, index) => (
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
                  props.setSelectedTopic(index);
                  setIsOpen(false);
                }}
              >
                {value.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
