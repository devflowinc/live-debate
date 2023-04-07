import { Menu, MenuItem, Popover, PopoverPanel } from "solid-headless";
import {
  Accessor,
  For,
  JSXElement,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
} from "solid-js";
import { FiExternalLink } from "solid-icons/fi";
import { AiOutlineClose } from "solid-icons/ai";

export interface comboboxItem {
  name: string;
  eventId: string;
  link?: string;
  [key: string]: unknown;
}

export interface ComboboxProps {
  options: Accessor<comboboxItem[]>;
  selected: Accessor<comboboxItem[]>;
  onSelect: (option: comboboxItem) => void;
  aboveOptionsElement?: JSXElement | null;
}

export const Combobox = (props: ComboboxProps) => {
  const [panelOpen, sePanelOpen] = createSignal(false);
  const [usingPanel, setUsingPanel] = createSignal(false);
  const [inputValue, setInputValue] = createSignal("");

  // eslint-disable-next-line prefer-const
  let inputBox: HTMLInputElement | undefined = undefined;

  const filteredOptionsWithIsSelected = createMemo(() => {
    const selected = props.selected();
    const optionsWithSelected = props.options().map((option) => {
      const isSelected = selected.some(
        (selectedOption) => selectedOption.eventId === option.eventId,
      );
      return {
        ...option,
        isSelected,
      };
    });

    if (!inputValue()) return optionsWithSelected;
    return optionsWithSelected.filter(
      (option) =>
        option.name.toLowerCase().includes(inputValue().toLowerCase()) &&
        !option.isSelected,
    );
  });

  createEffect(() => {
    const handler = (e: Event) => {
      if (!e.target) return;
      if (!(e.target as HTMLElement).closest(".afCombobox")) {
        sePanelOpen(false);
        setInputValue("");
      }
    };
    document.addEventListener("click", handler);

    onCleanup(() => {
      document.removeEventListener("click", handler);
    });
  });

  return (
    <div class="afCombobox w-full">
      <Popover class="relative w-full" defaultOpen={false}>
        <input
          class="w-full rounded border border-fuchsia-300 bg-white px-2 text-black dark:border-white dark:bg-slate-900 dark:text-white"
          type="text"
          onFocus={() => sePanelOpen(true)}
          onBlur={() => !usingPanel() && sePanelOpen(false)}
          value={inputValue()}
          onInput={(e) => setInputValue(e.currentTarget.value)}
          placeholder={placeholder()}
        />
        <PopoverPanel
          unmount={false}
          classList={{
            "absolute w-full left-1/2 z-10 mt-1 -translate-x-1/2 transform p-2 bg-pink-300 dark:bg-gray-800 rounded-lg":
              true,
            hidden: !panelOpen(),
          }}
          onMouseEnter={() => {
            setUsingPanel(true);
          }}
          onMouseLeave={() => {
            setUsingPanel(false);
          }}
        >
          {props.aboveOptionsElement}
          <Menu class="flex w-full flex-col space-y-1 overflow-y-auto rounded bg-pink-50 shadow-lg ring-1 ring-black ring-opacity-5 overflow-x-hidden dark:bg-gray-800">
            <For each={filteredOptionsWithIsSelected()}>
              {(option) => {
                if (option.isSelected) return;

                const onClick = (e: Event) => {
                  e.stopPropagation();
                  props.onSelect(option);
                  setInputValue("");
                };

                return (
                  <MenuItem
                    as="button"
                    class="afCombobox flex items-center justify-between rounded p-1 focus:bg-rose-400 focus:text-black focus:outline-none dark:focus:bg-orange-500 dark:focus:text-white dark:hover:bg-orange-500 dark:hover:text-white"
                    onClick={onClick}
                  >
                    <div class="flex flex-row justify-start space-x-2">
                      {option.link && (
                        <span onClick={(e) => e.stopPropagation()}>
                          <a href={option.link} target="_blank">
                            <FiExternalLink class="text-2xl" />
                          </a>
                        </span>
                      )}
                      <span class="text-left">{option.name}</span>
                    </div>
                  </MenuItem>
                );
              }}
            </For>
          </Menu>
        </PopoverPanel>
      </Popover>
    </div>
  );
};
