import { AiOutlinePlus } from "solid-icons/ai";

export const AddStatementButton = (props: {
  setShowStatementForm: (show: boolean) => void;
  valueName: string | undefined;
}) => {
  return (
    <>
      {!props.valueName ? (
        <div />
      ) : (
        <div class="flex w-full justify-center">
          <div
            onClick={() => props.setShowStatementForm(true)}
            class="flex w-fit cursor-pointer items-center space-x-2 rounded-lg border-2 border-purple-500 px-4 py-3 text-white"
          >
            <AiOutlinePlus />
            <div>Add Statement</div>
            <div class="flex-1" />
            <span class="font-bold">{props.valueName}</span>
            <span> value</span>
          </div>
        </div>
      )}
    </>
  );
};
