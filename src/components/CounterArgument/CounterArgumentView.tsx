import { CounterArgumentContent } from "./types";

export interface CounterArgumentViewProps {
  counterArgumentContent: CounterArgumentContent;
  onCounterArgumentClick: () => void;
}

export const CounterArgumentView = (props: CounterArgumentViewProps) => {
  return (
    <div class="flex rounded-md border-2 p-2 text-white">
      <div class="grid grid-cols-[18px_1fr]">
        <div class="font-bold">D</div>
        <div class="flex w-full flex-row items-center justify-between space-x-2">
          <span>{props.counterArgumentContent.description}</span>
        </div>
      </div>
    </div>
  );
};
