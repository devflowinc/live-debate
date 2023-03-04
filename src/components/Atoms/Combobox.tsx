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
import { FaSolidCheck } from "solid-icons/fa";

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

  const filteredOptionsWithSelected = createMemo(() => {
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
    return optionsWithSelected.filter((option) =>
      option.name.toLowerCase().includes(inputValue().toLowerCase()),
    );
  });

  createEffect(() => {
    const handler = (e: Event) => {
      if (!e.target) return;
      if (!(e.target as HTMLElement).closest(".afCombobox")) {
        sePanelOpen(false);
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
          class="w-full rounded border border-white bg-slate-900 px-2 text-white"
          type="text"
          onFocus={() => sePanelOpen(true)}
          onBlur={() => !usingPanel() && sePanelOpen(false)}
          value={inputValue()}
          onInput={(e) => setInputValue(e.currentTarget.value)}
        />
        <PopoverPanel
          unmount={false}
          classList={{
            "absolute w-full left-1/2 z-10 mt-1 -translate-x-1/2 transform p-2 bg-gray-800 rounded-lg":
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
          <Menu class="flex w-full flex-col space-y-1 overflow-y-auto bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 overflow-x-hidden">
            <For each={filteredOptionsWithSelected()}>
              {(option) => {
                const onClick = (e: Event) => {
                  e.stopPropagation();
                  props.onSelect(option);
                };

                return (
                  <MenuItem
                    as="button"
                    class="afCombobox flex items-center justify-between rounded p-1 focus:bg-orange-500 focus:text-white focus:outline-none hover:bg-orange-500 hover:text-white"
                    onClick={onClick}
                  >
                    <div class="flex flex-row space-x-2">
                      {option.link && (
                        <span onClick={(e) => e.stopPropagation()}>
                          <a href={option.link} target="_blank">
                            <FiExternalLink class="text-2xl" />
                          </a>
                        </span>
                      )}
                      <span>{option.name}</span>
                    </div>
                    {option.isSelected && (
                      <span>
                        <FaSolidCheck class="text-xl" />
                      </span>
                    )}
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
