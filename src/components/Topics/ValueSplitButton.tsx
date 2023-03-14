import { AiOutlineDown, AiOutlinePlus, AiOutlineUp } from "solid-icons/ai";
import {
  Menu,
  MenuItem,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "solid-headless";
import { Accessor, For, JSX, Show } from "solid-js";
import { TopicValue } from "./types";

export interface DescriptionProps {
  value: TopicValue;
  children: JSX.Element;
}

export interface ValueSplitButtonProps {
  selectedTopic: Accessor<number>;
  setSelectedTopic: (topic: number) => void;
  topicValues: Accessor<TopicValue[]>;
  showCreateValueForm: Accessor<boolean>;
  setShowCreateValueForm: (show: boolean) => void;
}

const ValueSplitButton = (props: ValueSplitButtonProps) => {
  return (
    <div>
      <div class="relative h-fit w-full rounded border border-purple-500 text-xl">
        <Popover defaultOpen={false} class="relative w-full">
          {({ isOpen }) => (
            <div class="relative w-full">
              <Show
                when={
                  props.topicValues().length > props.selectedTopic() &&
                  props.topicValues()[props.selectedTopic()].description
                }
              >
                <div class="text-regular w-full border-b border-purple-500 px-2 py-1 text-center text-base text-purple-800 dark:text-purple-300/90">
                  {props.topicValues()[props.selectedTopic()].description}
                </div>
              </Show>
              <div class="w-full">
                <table class="h-fit w-full table-auto items-center text-purple-500">
                  <thead>
                    <tr>
                      <th class="w-full border-r border-purple-500 px-2 font-normal">
                        {props.topicValues().length > props.selectedTopic()
                          ? props.topicValues()[props.selectedTopic()].name
                          : "No values exist"}
                      </th>
                      <th class="h-full w-fit border-r border-purple-500 px-2 hover:cursor-pointer">
                        {props.topicValues().length <= 1 ? (
                          <AiOutlineDown />
                        ) : (
                          <PopoverButton class="flex w-fit items-center ">
                            {isOpen() || props.topicValues().length <= 1 ? (
                              <AiOutlineUp />
                            ) : (
                              <AiOutlineDown />
                            )}
                          </PopoverButton>
                        )}
                      </th>
                      <th
                        class="w-fit border-purple-500 px-2 hover:cursor-pointer"
                        onClick={() => props.setShowCreateValueForm(true)}
                      >
                        <AiOutlinePlus />
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
              <Show when={isOpen()}>
                <PopoverPanel class="absolute z-10 w-full" unmount={false}>
                  <Menu class="left-0 mt-1 flex w-full origin-top-left flex-col space-y-1 rounded-lg bg-fuchsia-200 dark:bg-gray-800 p-1 py-2 shadow-lg ring-1 ring-black ring-opacity-5">
                    <MenuItem as="button" aria-label="hidden" />
                    <For each={props.topicValues()}>
                      {(value, index) => {
                        const updateSelectedTopic = () =>
                          props.setSelectedTopic(index());

                        return (
                          <PopoverButton>
                            <MenuItem
                              as="div"
                              classList={{
                                "text-purple-500 rounded px-2 hover:cursor-pointer hover:bg-blue-300 dark:hover:bg-gray-700 w-full":
                                  true,
                                "bg-sky-200 dark:bg-gray-700 text-purple-500":
                                  props.topicValues()[props.selectedTopic()]
                                    .name === value.name,
                                "text-purple-400":
                                  props.topicValues()[props.selectedTopic()]
                                    .name !== value.name,
                              }}
                              onClick={updateSelectedTopic}
                            >
                              {value.name}
                            </MenuItem>
                          </PopoverButton>
                        );
                      }}
                    </For>
                  </Menu>
                </PopoverPanel>
              </Show>
            </div>
          )}
        </Popover>
      </div>
    </div>
  );
};

export default ValueSplitButton;
