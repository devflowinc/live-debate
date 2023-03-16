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
    return optionsWithSelected.filter((option) =>
      option.name.toLowerCase().includes(inputValue().toLowerCase()),
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
        <div class="flex w-full rounded border border-white bg-slate-900 px-2 text-white">
          <For each={props.selected()}>
            {(choice) => (
              <div class="w-full rounded-lg bg-slate-700 px-3 py-2">
                {choice.name}
              </div>
            )}
          </For>
          <input
            class="flex w-full rounded bg-slate-900 px-2 text-white focus:outline-none focus:ring-0"
            type="text"
            onFocus={() => sePanelOpen(true)}
            onBlur={() => !usingPanel() && sePanelOpen(false)}
            value={inputValue()}
            onInput={(e) => setInputValue(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key == "Backspace") {
                if (inputValue() == "" && props.selected().length > 0) {
                  const selected = props.selected();
                  props.onSelect(selected[selected.length - 1]);
                  setInputValue("");
                }
              } else if (e.key == "Escape") {
                sePanelOpen(false);
              } else if (e.key == "Tab") {
                e.preventDefault(); // Prevents tabbing out of the input
                const options = filteredOptionsWithIsSelected();
                if (options.length == 1) {
                  props.onSelect(options[0]);
                  setInputValue("");
                }
              }
            }}
          />
        </div>
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
