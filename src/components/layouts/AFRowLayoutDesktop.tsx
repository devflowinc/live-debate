import { Event, getEventHash } from "nostr-tools";
import { AiOutlinePlus } from "solid-icons/ai";
import {
  Accessor,
  createEffect,
  createSignal,
  For,
  useContext,
} from "solid-js";
import { GlobalContext, RelayContainer } from "~/contexts/GlobalContext";
import { emitEventToConnectedRelays } from "~/nostr-types";
import { CreateStatementForm } from "~/components/Statements/CreateStatementForm";
import { Statement } from "~/components/Statements/types";
import { getUTCSecondsSinceEpoch } from "../Topics/TopicsDisplay";
import { Topic, TopicValue } from "../Topics/types";

interface StatementViewProps {
  statement: Statement;
  visible: boolean;
}

export const subscribeToArguflowFeedByEventAndValue = ({
  connectedRelayContainers,
  topic,
  onStatementReceived,
}: {
  topic: Topic;
  connectedRelayContainers: RelayContainer[];
  onStatementReceived: (event: Event) => void;
}) => {
  connectedRelayContainers.forEach((relayContainer) => {
    if (!relayContainer.relay) {
      return;
    }
    const relay = relayContainer.relay;
    const topicEventSub = relay.sub(
      [
        {
          kinds: [42],
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ["#e"]: [topic.event.id!],
          // ["#p"]: [valuePubKey],
        },
      ],
      {
        skipVerification: true,
      },
    );

    topicEventSub.on("event", (event: Event) => {
      onStatementReceived(event);
    });
  });
};

export const StatementView = (props: StatementViewProps) => {
  return (
    <div
      classList={{
        "rounded-md py-3 px-4 text-white": true,
        "w-full px-0 py-0 text-center": !props.visible,
        "border-2 border-purple-500 min-w-lg": props.visible,
      }}
    >
      {props.visible && props.statement.statement}
      {!props.visible && (
        <div class="flex flex-col -space-y-3">
          <div>{">.<"}</div>
          <div>{"/\\\\"}</div>
          <div>{"\\\\/"}</div>
          <div>{">|<"}</div>
        </div>
      )}
    </div>
  );
};

export const AddButton = (props: {
  setShowStatementForm: (show: boolean) => void;
  visible: boolean;
}) => {
  return (
    <div>
      {props.visible && (
        <div
          onClick={() => props.setShowStatementForm(true)}
          class="flex cursor-pointer items-center space-x-2 border-4 border-purple-500 px-4 py-3 text-white"
        >
          <AiOutlinePlus />
          <div>Add Statement</div>
        </div>
      )}
      {!props.visible && (
        <div class="mb-2 flex w-full items-center rounded-full border-2 border-purple-500 p-1 text-center text-white">
          <AiOutlinePlus />
        </div>
      )}
    </div>
  );
};

interface AFRowLayoutDesktopProps {
  topic: Accessor<Topic | null>;
  currentTopicValue: Accessor<TopicValue | undefined>;
  subscribedToTopicOnRelay: Accessor<string[]>;
  viewMode: "aff" | "neg";
}

export const AFRowLayoutDesktop = (props: AFRowLayoutDesktopProps) => {
  const [expandedColumns, setExpandedColumns] = createSignal<number[]>([0, 1]);
  const [showStatementForm, setShowStatementForm] = createSignal(false);
  const globalContext = useContext(GlobalContext);

  const [openingStatements, setOpeningStatements] = createSignal<Statement[]>(
    [],
  );

  createEffect(() => {
    if (!globalContext.relays?.().find((relay) => relay.connected)) {
      return;
    }

    const connectedRelayContainers = globalContext
      .relays()
      .filter((relay) => relay.connected);
    const unusedConnectedRelayContainers = connectedRelayContainers.filter(
      (relay) =>
        !props
          .subscribedToTopicOnRelay()
          .find((relayName) => relayName === relay.name),
    );

    const topic = props.topic();
    if (!topic) return;

    subscribeToArguflowFeedByEventAndValue({
      connectedRelayContainers: unusedConnectedRelayContainers,
      topic: topic,
      onStatementReceived: (value) => {
        // CREATE STATEMENT
        console.log("gotValue", value);
        const currentTopic = props.topic();
        if (!currentTopic) return;

        setOpeningStatements((prev) => {
          return [
            ...prev,
            {
              topic: currentTopic,
              statement: "",
              previousEvent: value,
              type: "aff",
            },
          ];
        });
      },
    });
  });

  const getClassNamesList = (index: number) => {
    const primaryColor =
      props.viewMode === "aff" ? "border-emerald-500" : "border-rose-500";
    const secondaryColor =
      props.viewMode !== "aff" ? "border-emerald-500" : "border-rose-500";

    const color = index == 1 ? secondaryColor : primaryColor;
    const defaults = `border-4 h-[60vh] rounded-xl ${color} flex flex-col`;

    return {
      [defaults]: true,
      "w-[46%] space-y-5 p-5": expandedColumns().includes(index),
      "w-[2%] items-center": !expandedColumns().includes(index),
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
    type,
  }: {
    statement: string;
    type: "aff" | "neg";
  }) => {
    // TODO add toatsts
    // TODO Sanitize inputs
    const eventPublicKey = globalContext.connectedUser?.()?.publicKey;
    if (!eventPublicKey) return;
    const topic = props.topic();
    if (!topic) return;

    const id = getEventHash(topic.event);
    const createdAt = getUTCSecondsSinceEpoch();

    const previousEvents: Event[] = [];

    const previousPubKeys = [""];

    const event: Event = {
      id: "",
      sig: "",
      kind: 42,
      pubkey: eventPublicKey,
      tags: [
        ["arguflow"],
        ["arguflow-statement"],
        ...previousEvents
          .map(getEventHash)
          .map((previousEventId) => [
            "e",
            `${previousEventId}`,
            "nostr.arguflow.gg",
            "reply",
          ]),
        ["p", ...previousPubKeys], // Reference what it is replying too
      ],
      created_at: createdAt,
      content: JSON.stringify({
        statement,
        topicId: id,
        previousEvent: previousEvents[previousEvents.length - 1].id,
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
          <div class="flex-grow" />
          {!showStatementForm() && (
            <AddButton
              setShowStatementForm={setShowStatementForm}
              visible={expandedColumns().includes(0)}
            />
          )}
          {showStatementForm() &&
            expandedColumns().includes(0) &&
            props.currentTopicValue()?.event && (
              <CreateStatementForm
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                previousEvent={props.currentTopicValue()!.event!}
                topic={props.topic}
                type={props.viewMode}
                setShowStatementForm={setShowStatementForm}
                onCreateStatment={onCreateStatment}
              />
            )}
        </div>
        <div
          onMouseEnter={() => toggleColumn(1)}
          classList={getClassNamesList(1)}
        />
        <div
          onMouseEnter={() => toggleColumn(2)}
          classList={getClassNamesList(2)}
        />
        <div
          onMouseEnter={() => toggleColumn(3)}
          classList={getClassNamesList(3)}
        />
      </div>
    </div>
  );
};
