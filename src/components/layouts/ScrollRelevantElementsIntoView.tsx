import { VsEye } from "solid-icons/vs";
import { useContext } from "solid-js";
import { GlobalContext } from "~/contexts/GlobalContext";

export interface ScrollRelevantElementsIntoViewProps {
  statementId: string;
  typesToScrollIntoView: (
    | "statement"
    | "rebuttal"
    | "counterargument"
    | "summary"
  )[];
}

export const scrollElementsIntoView = ({
  statementId,
  typesToScrollIntoView,
}: ScrollRelevantElementsIntoViewProps): void => {
  if (typesToScrollIntoView.includes("statement")) {
    const statementElementId = `statement-${statementId}`;
    const statementElement = document.getElementById(statementElementId);
    if (statementElement) {
      statementElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }

  if (typesToScrollIntoView.includes("rebuttal")) {
    const rebuttalElementId = `rebuttalgroup-${statementId}`;
    const rebuttalElement = document.getElementById(rebuttalElementId);
    if (rebuttalElement) {
      rebuttalElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }

  if (typesToScrollIntoView.includes("counterargument")) {
    const counterAgumentElementId = `counterargumentgroup-${statementId}`;
    const counterAgumentElement = document.getElementById(
      counterAgumentElementId,
    );
    if (counterAgumentElement) {
      counterAgumentElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }

  if (typesToScrollIntoView.includes("summary")) {
    const summaryElementId = `summarygroup-${statementId}`;
    const summaryElement = document.getElementById(summaryElementId);
    if (summaryElement) {
      summaryElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }
};

export const ScrollRelevantElementsIntoViewButton = (
  props: ScrollRelevantElementsIntoViewProps,
) => {
  const globalContext = useContext(GlobalContext);

  return (
    <button
      type="button"
      class="h-fit w-fit rounded-full border border-yellow-500 p-1 text-yellow-500"
      onClick={() => {
        globalContext.setHighlightedEventId(
          globalContext.highlightedEventId?.() === props.statementId
            ? ""
            : props.statementId,
        );
        scrollElementsIntoView({
          statementId: props.statementId,
          typesToScrollIntoView: props.typesToScrollIntoView,
        });
      }}
    >
      <VsEye />
    </button>
  );
};
