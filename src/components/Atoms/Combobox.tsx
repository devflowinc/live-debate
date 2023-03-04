import { Menu, MenuItem, Popover, PopoverPanel } from "solid-headless";
import {
  Accessor,
  For,
  JSXElement,
  createEffect,
  createSignal,
  onCleanup,
} from "solid-js";
import { FiExternalLink } from "solid-icons/fi";

export interface comboboxItem {
  name: string;
  link?: string;
  id: string;
  [key: string]: unknown;
}

export interface ComboboxProps {
  options: Accessor<comboboxItem[]>;
  // selected: Accessor<comboboxItem[]>;
  // onSelect: (option: nameAndAny) => void;
  // onRemove: (option: nameAndAny) => void;
  inputValue: Accessor<string>;
  setInputValue: (value: string) => void;
  aboveOptionsElement?: JSXElement | null;
}

export const Combobox = (props: ComboboxProps) => {
  const [panelOpen, sePanelOpen] = createSignal(false);
  const [usingPanel, setUsingPanel] = createSignal(false);

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
          value={props.inputValue()}
          onInput={(e) => props.setInputValue(e.currentTarget.value)}
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
            <For each={props.options()}>
              {(option) => (
                <MenuItem
                  as="button"
                  class="flex items-center justify-between rounded p-1 focus:bg-orange-500 focus:text-white focus:outline-none hover:bg-orange-500 hover:text-white"
                >
                  <span>{option.name}</span>
                  <span onClick={(e) => e.stopPropagation()}>
                    <a href={option.link} target="_blank">
                      <FiExternalLink class="text-2xl" />
                    </a>
                  </span>
                </MenuItem>
              )}
            </For>
          </Menu>
        </PopoverPanel>
      </Popover>
    </div>
  );
};
