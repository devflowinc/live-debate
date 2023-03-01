import { VsReply } from "solid-icons/vs";
import { For } from "solid-js";
import { RebuttalContent } from "./types";

export interface RebuttalViewProps {
  rebuttalContent: RebuttalContent;
  onCounterArgumentClick: () => void;
}

export const RebuttalView = (props: RebuttalViewProps) => {
  return (
    <div
      classList={{
        "rounded-md border-2 p-2 text-white flex": true,
        "border-orange-500": !!props.rebuttalContent.counterWarrant,
        "border-fuchsia-500": !props.rebuttalContent.counterWarrant,
      }}
    >
      <div
        classList={{
          "flex flex-col space-y-2 ": true,
        }}
      >
        {/* loop over the keys of props.rebuttal.rebuttalCWI */}
        <For each={Object.keys(props.rebuttalContent)}>
          {(key) => {
            return (
              <div class="grid grid-cols-[18px_1fr]">
                <div
                  classList={{
                    "font-bold": true,
                    "text-orange-500": key == "counterWarrant",
                  }}
                >
                  {key == "counterWarrant" ? "W" : "D"}
                </div>
                <div
                  classList={{
                    "w-full flex flex-row space-x-2 justify-between items-center":
                      true,
                    "text-orange-500": key == "counterWarrant",
                  }}
                >
                  <span>
                    {props.rebuttalContent[key as keyof RebuttalContent]}
                  </span>
                </div>
              </div>
            );
          }}
        </For>
      </div>
      <div class="flex-1" />
      <button
        type="button"
        onClick={() => props.onCounterArgumentClick()}
        aria-label="Create Warrant Rebuttal"
        classList={{
          "p-1 border rounded-full h-fit self-center": true,
        }}
      >
        <VsReply />
      </button>
    </div>
  );
};
