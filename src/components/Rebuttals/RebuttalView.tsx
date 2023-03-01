import { For } from "solid-js";
import { RebuttalContent } from "../Statements/types";

export interface RebuttalViewProps {
  rebuttalContent: RebuttalContent;
}

export const RebuttalView = (props: RebuttalViewProps) => {
  return (
    <div
      classList={{
        "flex flex-col space-y-2 rounded-md border-2 p-2 text-white": true,
        "border-orange-500": !!props.rebuttalContent.counterWarrant,
        "border-fuchsia-500": !props.rebuttalContent.counterWarrant,
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
  );
};
