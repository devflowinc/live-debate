export const scrollElementsIntoView = ({
  statementId,
  typesToScrollIntoView,
}: {
  statementId: string;
  typesToScrollIntoView: ("statement" | "rebuttal" | "counterargument")[];
}): void => {
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
};
