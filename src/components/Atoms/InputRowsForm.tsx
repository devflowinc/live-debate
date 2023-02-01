import { Accessor, For } from "solid-js";

export interface InputGroup {
  label: string;
  inputValue: Accessor<string>;
  setInputValue: (value: string) => void;
}

export interface InputRowsFormProps {
  createButtonText: string;
  onCreate: () => void;
  onCancel: () => void;
  inputGroups: InputGroup[];
}

const InputRowsForm = (props: InputRowsFormProps) => {
  return (
    <div class="w-full rounded-lg border border-white px-2 py-2 text-white">
      <div class="flex flex-col space-y-4">
        <div class="flex flex-col space-y-1">
          <For each={props.inputGroups}>
            {(inputGroup: InputGroup) => (
              <div class="w-full">
                <div>{inputGroup.label}:</div>
                <input
                  class="w-full rounded border border-white bg-slate-900 px-2 text-white"
                  type="text"
                  onInput={(e) =>
                    inputGroup.setInputValue(e.currentTarget.value)
                  }
                  value={inputGroup.inputValue()}
                />
              </div>
            )}
          </For>
        </div>
        <div class="mt-2 flex w-full justify-end space-x-2">
          <button
            class="w-fit rounded-full border border-red-500 bg-transparent px-2 text-red-500"
            onClick={() => props.onCancel()}
          >
            Cancel
          </button>
          <button
            class="w-fit rounded-full border border-green-500 bg-transparent px-2 text-green-500"
            onClick={() => props.onCreate()}
          >
            {props.createButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputRowsForm;
