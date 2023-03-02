import { VsEye, VsReply } from "solid-icons/vs";
import { For } from "solid-js";
import { Rebuttal, RebuttalContent } from "./types";
import { scrollElementsIntoView } from "../layouts/ScrollRelevantElementsIntoView";

export interface RebuttalViewProps {
  rebuttal: Rebuttal;
  onCounterArgumentClick: () => void;
}

export const RebuttalView = (props: RebuttalViewProps) => {
  return (
    <div
      classList={{
        "rounded-md border-2 p-2 text-white w-full flex flex-col space-y-2":
          true,
        "border-orange-500": !!props.rebuttal.rebuttalContent.counterWarrant,
        "border-fuchsia-500": !props.rebuttal.rebuttalContent.counterWarrant,
      }}
    >
      <div class="flex w-full flex-row items-center justify-between">
        <div
          classList={{
            "flex flex-col space-y-2 ": true,
          }}
        >
          {/* loop over the keys of props.rebuttal.rebuttalCWI */}
          <For each={Object.keys(props.rebuttal.rebuttalContent)}>
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
                      {
                        props.rebuttal.rebuttalContent[
                          key as keyof RebuttalContent
                        ]
                      }
                    </span>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
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
      <div class="flex flex-row space-x-2">
        <button
          type="button"
          class="h-fit rounded-full border border-yellow-500 p-1 text-yellow-500"
          onClick={() => {
            scrollElementsIntoView({
              statementId: props.rebuttal.originalStatementEventId,
              typesToScrollIntoView: ["statement", "counterargument"],
            });
          }}
        >
          <VsEye />
        </button>
      </div>
    </div>
  );
};
