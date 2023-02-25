import { Event, getEventHash } from "nostr-tools";
import { AiOutlinePlus } from "solid-icons/ai";
import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  For,
  useContext,
} from "solid-js";
import { GlobalContext, RelayContainer } from "~/contexts/GlobalContext";
import { emitEventToConnectedRelays } from "~/nostr-types";
import { CreateStatementForm } from "~/components/Statements/CreateStatementForm";
import { CWI, Statement, implementsCWI } from "~/components/Statements/types";
import { getUTCSecondsSinceEpoch } from "../Topics/TopicsDisplay";
import { Topic, TopicValue } from "../Topics/types";

interface StatementCWIViewProps {
  statement: Statement;
}

export const subscribeToArguflowFeedByEventAndValue = ({
  connectedRelayContainers,
  topic,
  onStatementReceived,
  onSubscriptionCreated,
}: {
  topic: Topic;
  connectedRelayContainers: RelayContainer[];
  onStatementReceived: (event: Event) => void;
  onSubscriptionCreated?: (relayName: string) => void;
}) => {
  connectedRelayContainers.forEach((relayContainer) => {
    if (!relayContainer.relay) {
      return;
    }
    onSubscriptionCreated?.(relayContainer.name);
    const relay = relayContainer.relay;
    const topicEventSub = relay.sub(
      [
        {
          kinds: [42],
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ["#e"]: [topic.event.id!],
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

export const StatementCWIView = (props: StatementCWIViewProps) => {
  return (
    <div class="flex flex-col space-y-2 rounded-md border-2 border-indigo-500/75 p-2 text-white">
      {/* loop over the keys of props.statement.statementCWI */}
      <For each={Object.keys(props.statement.statementCWI)}>
        {(key) => {
          return (
            <div class="grid grid-cols-[18px_1fr]">
              <div
                classList={{
                  "font-bold": true,
                  "text-blue-500": key === "claim",
                  "text-orange-500": key === "warrant",
                  "text-fuchsia-500": key === "impact",
                }}
              >
                {key.charAt(0).toUpperCase()}
              </div>
              <div
                classList={{
                  "text-blue-500": key === "claim",
                  "text-orange-500": key === "warrant",
                  "text-fuchsia-500": key === "impact",
                }}
              >
                {props.statement.statementCWI[key as keyof CWI]}
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
};

export const AddButton = (props: {
  setShowStatementForm: (show: boolean) => void;
  valueName: string;
}) => {
  return (
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
  );
};

interface AFRowLayoutDesktopProps {
  topic: Accessor<Topic | null>;
  currentTopicValue: Accessor<TopicValue | undefined>;
  viewMode: "aff" | "neg";
}

export const AFRowLayoutDesktop = (props: AFRowLayoutDesktopProps) => {
  const [expandedColumns, setExpandedColumns] = createSignal<number[]>([0, 1]);
  const [showStatementForm, setShowStatementForm] = createSignal(false);
  const [subscribedToValueOnRelay, setSubscribedToValueOnRelay] = createSignal<
    string[]
  >([]);
  const globalContext = useContext(GlobalContext);

  const [openingStatements, setOpeningStatements] = createSignal<Statement[]>(
    [],
  );

  const openingStatementsToShow = createMemo(() =>
    openingStatements().filter((statement) => {
      console.log("stst", statement, props.currentTopicValue()?.event?.id);
      return statement.previousEventId === props.currentTopicValue()?.event?.id;
    }),
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
        !subscribedToValueOnRelay().find(
          (relayName) => relayName === relay.name,
        ),
    );

    const topic = props.topic();
    if (!topic) return;
    subscribeToArguflowFeedByEventAndValue({
      connectedRelayContainers: unusedConnectedRelayContainers,
      topic: topic,
      onSubscriptionCreated: (name) => {
        setSubscribedToValueOnRelay((prev) => {
          return [...prev, name];
        });
      },
      onStatementReceived: (event) => {

        const content: unknown = JSON.parse(event.content);
        if (typeof content !== "object" || content === null) return;
        const statementCWI: unknown =
          "statementCWI" in content && content.statementCWI;
        const type = "type" in content && content.type;
        const previousEvent = "previousEvent" in content && content.previousEvent;

        const currentTopic = props.topic();
        if (
          !previousEvent ||
          typeof previousEvent !== "string" ||
          !currentTopic ||
          typeof type !== "string" ||
          (type != "aff" && type != "neg") ||
          !implementsCWI(statementCWI)
        ) {
          return;
        }
        setOpeningStatements((prev) => {
          if (prev.find((statement) => statement.event.id === event.id)) {
            return prev;
          }
          return [
            ...prev,
            {
              topic: currentTopic,
              event: event,
              previousEventId: previousEvent,
              statementCWI: statementCWI,
              type: type,
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

  const getType = (index: number) => {
    let view = props.viewMode;
    if (index == 1) {
      view = view == "aff" ? "neg" : "aff";
    }
    return view;
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

  const onCreateStatementCWI = ({
    statementCWI,
    type,
  }: {
    statementCWI: CWI;
    type: "aff" | "neg";
  }) => {
    const eventPublicKey = globalContext.connectedUser?.()?.publicKey;
    if (!eventPublicKey) return;
    const topic = props.topic();
    if (!topic) return;

    const id = getEventHash(topic.event);
    const createdAt = getUTCSecondsSinceEpoch();

    const previousEvents: Event[] = [];

    const topicValue = props.currentTopicValue();
    const currentTopic = props.topic();

    if (currentTopic?.event) {
      previousEvents.push(currentTopic.event);
    }

    if (topicValue?.event) {
      previousEvents.push(topicValue.event);
    }

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
        ["p", ...previousEvents.map((event) => event.pubkey)], // Reference what it is replying too
      ],
      created_at: createdAt,
      content: JSON.stringify({
        statementCWI: statementCWI,
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
      globalContext.createToast({
        message: `Statement successfully created for ${
          topicValue?.name ? topicValue.name : "NO NAME?????"
        }`,
        type: "success",
      });
    });
  };

  return (
    <div>
      <div class="flex w-full space-x-2 px-10">
        <div
          onMouseEnter={() => toggleColumn(0)}
          classList={getClassNamesList(0)}
        >
          {expandedColumns().includes(0) && (
            <div class="flex h-full flex-col justify-between">
              <div class="flex flex-col space-y-2">
                <For each={openingStatementsToShow()}>
                  {(statementCWI) => (
                    <StatementCWIView statement={statementCWI} />
                  )}
                </For>
              </div>
              {!showStatementForm() && props.currentTopicValue() && (
                <AddButton
                  // Must exist since topicValue exists
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  valueName={props.currentTopicValue()!.name}
                  setShowStatementForm={setShowStatementForm}
                />
              )}
              {showStatementForm() &&
                expandedColumns().includes(0) &&
                props.currentTopicValue()?.event && (
                  <CreateStatementForm
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    previousEvent={props.currentTopicValue()!.event!}
                    topic={props.topic}
                    type={getType(0)}
                    setShowStatementForm={setShowStatementForm}
                    onCreateStatmentCWI={onCreateStatementCWI}
                  />
                )}
            </div>
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
