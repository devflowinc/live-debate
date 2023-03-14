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
            class="flex w-fit cursor-pointer items-center space-x-2 rounded-lg border-2 border-blue-500 dark:border-white px-4 py-3 text-blue-600 dark:text-white"
          >
            <AiOutlinePlus />
            <div>Add Statement</div>
          </div>
        </div>
      )}
    </>
  );
};
