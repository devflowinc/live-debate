import { AiOutlineDown, AiOutlinePlus, AiOutlineUp } from "solid-icons/ai";
import { Menu, MenuItem, Popover, PopoverButton, PopoverPanel, Transition } from "solid-headless";
import { Accessor, createSignal, For, JSX, Show } from "solid-js";
import { TopicValue } from "./types";

export interface DescriptionProps {
  value: TopicValue;
  children: JSX.Element;
}

export const Description = (props: DescriptionProps) => {
  let [hover, setHover] = createSignal(false);
  return (
    <div
      class="flex"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {props.children}
      <Show
        when={hover()}>
        <span class="bg-gray-500 rounded absolute z-20 text-white text-sm left-32 w-full line-clamp-1">
          {props.value.description}
        </span>

      </Show>
    </div>
  );
};

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
      <div class="w-full relative h-fit rounded border border-purple-500 bg-transparent text-xl">
        <Popover defaultOpen={false} class="relative">
          {({ isOpen }) => (
            <>
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
                    >
                      {props.topicValues().length <= 1 ? (
                        <AiOutlineDown />
                      ) :
                        <PopoverButton class="flex items-center ">
                          {isOpen() || props.topicValues().length <= 1 ? (
                            <AiOutlineUp />
                          ) : (
                            <AiOutlineDown />
                          )}
                        </PopoverButton>
                      }
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
              <Transition
                show={isOpen()}
                enter="transition duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <PopoverPanel class="absolute z-10 px-4 translate-x-[-8%] w-full" unmount={false}>
                  <Menu class="left-0 mt-1 w-full origin-top-left rounded-lg bg-gray-800 py-2 shadow-lg ring-1 ring-black ring-opacity-5 flex flex-col space-y-1 p-1">
                    <For each={props.topicValues()}>
                      {(value, index) => (
                        <Description value={value} index={index}>
                          <MenuItem
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
                          > <PopoverButton
                            onClick={() => {
                              props.setSelectedTopic(index());
                            }}
                          >
                              {value.name}
                            </PopoverButton>
                          </MenuItem>
                        </Description>
                      )}
                    </For>
                  </Menu>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>

  );
};

export default ValueSplitButton;
