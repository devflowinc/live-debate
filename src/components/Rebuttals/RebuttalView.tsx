import { VsReply } from "solid-icons/vs";
import { For, Show } from "solid-js";
import { Rebuttal } from "./types";
import { ScrollRelevantElementsIntoViewButton } from "../layouts/ScrollRelevantElementsIntoView";
import NostrUserName from "../Atoms/NostrUserName";

export interface RebuttalViewProps {
  rebuttal: Rebuttal;
  onCounterArgumentClick: () => void;
  highlighted?: boolean;
}

export const RebuttalView = (props: RebuttalViewProps) => {
  return (
    <div
      classList={{
        "rounded-md border-2 p-2 text-black dark:text-white w-full flex flex-col space-y-2":
          true,
        "border-orange-500": !!props.rebuttal.rebuttalContent.counterWarrants,
        "border-fuchsia-500": !props.rebuttal.rebuttalContent.counterWarrants,
        "dark:bg-neutral-900": props.highlighted,
      }}
    >
      <div class="flex w-full flex-row items-center justify-between space-x-2">
        <div class="flex flex-col space-y-2 ">
          <div class="grid grid-cols-[24px_1fr] gap-y-2">
            {!!props.rebuttal.rebuttalContent.counterWarrants && (
              <>
                <div class="font-bold text-orange-500">W</div>
                <div class="w-full text-orange-500">
                  <For each={props.rebuttal.rebuttalContent.counterWarrants}>
                    {(warrant, index) => {
                      return (
                        <>
                          <a
                            href={warrant.link}
                            target="_blank"
                            rel="noreferrer"
                            class="block w-full underline"
                          >
                            {warrant.name}
                            <Show
                              when={
                                index() <
                                (props.rebuttal.rebuttalContent.counterWarrants
                                  ?.length ?? 1) -
                                  1
                              }
                            >
                              <span class="text-black dark:text-white">{`  ,`}</span>
                            </Show>
                          </a>
                        </>
                      );
                    }}
                  </For>
                </div>
              </>
            )}

            <div class="font-bold">D</div>
            <div class="flex w-full flex-row items-center justify-between space-x-2">
              <span>{props.rebuttal.rebuttalContent.description}</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => props.onCounterArgumentClick()}
          aria-label="Create Counterargument"
          classList={{
            "p-1 border rounded-full h-fit self-center": true,
            "text-orange-500 border-orange-500":
              !!props.rebuttal.rebuttalContent.counterWarrants,
            "text-fuchsia-500 border-fuchsia-500":
              !props.rebuttal.rebuttalContent.counterWarrants,
          }}
        >
          <VsReply />
        </button>
      </div>
      <div class="flex items-center justify-between">
        <ScrollRelevantElementsIntoViewButton
          statementId={props.rebuttal.originalStatementEventId}
          typesToScrollIntoView={["statement", "counterargument", "summary"]}
        />
        <NostrUserName pubkey={props.rebuttal.event.pubkey} />
      </div>
    </div>
  );
};
