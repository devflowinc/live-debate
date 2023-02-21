import { Event, getEventHash } from "nostr-tools";
import { AiOutlinePlus } from "solid-icons/ai";
import { createSignal, For, useContext } from "solid-js";
import { GlobalContext } from "~/contexts/GlobalContext";
import { emitEventToConnectedRelays } from "~/nostr-types";
import { CreateStatementForm } from "~/components/Statements/CreateStatementForm";
import { Statement } from "~/components/Statements/types";
import { getUTCSecondsSinceEpoch } from "../Topics/TopicsDisplay";

interface StatementViewProps {
  statement: Statement;
  visible: boolean;
}

export const StatementView = (props: StatementViewProps) => {
  return (
    <div
      classList={{
        "border-2 border-purple-500 rounded-md py-3 px-4 text-white": true,
        "w-full px-0 py-0 text-center": !props.visible,
        "min-w-lg": props.visible,
      }}
    >
      {props.visible && props.statement.statement}
    </div>
  );
};

interface AFRowLayoutDesktopProps {
  topicId: string;
  viewMode: "aff" | "neg";
}

export const AFRowLayoutDesktop = (props: AFRowLayoutDesktopProps) => {
  const [expandedColumns, setExpandedColumns] = createSignal<number[]>([0, 1]);
  const [showStatementForm, setShowStatementForm] = createSignal(false);
  const globalContext = useContext(GlobalContext);

  const [openingStatements, setOpeningStatements] = createSignal<Statement[]>([
    {
      topicId: props.topicId,
      previousEvent: "",
      statement: "Opening Statement 1",
      type: "aff",
    },
    {
      topicId: props.topicId,
      previousEvent: "",
      statement: "Opening Statement 2",
      type: "aff",
    },
  ]);

  const getClassNamesList = (index: number) => {
    const primaryColor =
      props.viewMode === "aff" ? "border-emerald-500" : "border-rose-500";
    const secondaryColor =
      props.viewMode !== "aff" ? "border-emerald-500" : "border-rose-500";

    const color = index == 1 ? secondaryColor : primaryColor;
    const defaults = `border-4 h-[60vh] rounded-xl ${color}`;

    return {
      [defaults]: true,
      "w-[46%] flex flex-col space-y-5 p-5": expandedColumns().includes(index),
      "w-[2%]": !expandedColumns().includes(index),
    };
  };

  const toggleColumn = (index: number) => {
    const expandedColumnsCopy = [...expandedColumns()];
    if (!expandedColumnsCopy.includes(index)) {
      setExpandedColumns((prevExpandedCols) => [
        ...prevExpandedCols.slice(1),
        index,
      ]);
    }
  };

  const onCreateStatment = ({
    statement,
    topicId,
    previousEvent,
    type,
  }: Statement) => {
    // TODO add toatsts
    // TODO Sanitize inputs
    const eventPublicKey = globalContext.connectedUser?.()?.publicKey;

    const topicEventId = props.topicId;

    if (!eventPublicKey || !topicEventId) return;

    const createdAt = getUTCSecondsSinceEpoch();

    const previousPubKeys = [""];

    const event: Event = {
      id: "",
      sig: "",
      kind: 42,
      pubkey: eventPublicKey,
      tags: [
        ["arguflow"],
        ["arguflow-topic-value"],
        ["e", `${previousEvent}`, "nostr.arguflow.gg", "reply"],
        ["p", ...previousPubKeys], // Reference what it is replying too
      ],
      created_at: createdAt,
      content: JSON.stringify({
        statement,
        topicId: `${topicId}`,
        previousEvent,
        type,
      }),
    };
    event.id = getEventHash(event);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
    (window as any).nostr.signEvent(event).then((signedEvent: Event) => {
      if (globalContext.relays) {
        const connectedRelayContainers = globalContext
          .relays()
          .filter((relay) => relay.connected);
        emitEventToConnectedRelays({
          event: signedEvent,
          connectedRelayContainers: connectedRelayContainers,
        });
      }
      setShowStatementForm(false);
    });
  };

  return (
    <div>
      <div class="flex max-w-[40%] items-center justify-center">
        <div
          onClick={() => setShowStatementForm(true)}
          class="flex cursor-pointer items-center space-x-2 border border-purple-500 px-4 py-3 text-white"
        >
          <AiOutlinePlus />
          <div>Add Opening Statement</div>
        </div>
      </div>
      {showStatementForm() && (
        <CreateStatementForm
          topicId={props.topicId}
          type={props.viewMode}
          setShowStatementForm={setShowStatementForm}
          onCreateStatment={onCreateStatment}
        />
      )}
      <div class="flex w-full space-x-2 px-10">
        <div
          onMouseEnter={() => toggleColumn(0)}
          classList={getClassNamesList(0)}
        >
          <For each={openingStatements()}>
            {(statement) => (
              <StatementView
                statement={statement}
                visible={expandedColumns().includes(0)}
              />
            )}
          </For>
        </div>
        <div
          onMouseEnter={() => toggleColumn(1)}
          classList={getClassNamesList(1)}
        ></div>
        <div
          onMouseEnter={() => toggleColumn(2)}
          classList={getClassNamesList(2)}
        ></div>
        <div
          onMouseEnter={() => toggleColumn(3)}
          classList={getClassNamesList(3)}
        ></div>
      </div>
    </div>
  );
};
