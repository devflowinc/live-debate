import { Event, getEventHash } from "nostr-tools";
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
import { StatementCWIView } from "../Statements/StatementCWI";
import { AddStatementButton } from "../Statements/AddStatementButton";
import { Column } from "./Column";
import { CreateWarrantRebuttalForm } from "../Rebuttals/CreateWarrantRebuttalForm";
import { CreateImpactRebuttalForm } from "../Rebuttals/CreateImpactRebuttalForm";

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

export interface AFRowLayoutDesktopProps {
  topic: Accessor<Topic | null>;
  currentTopicValue: Accessor<TopicValue | undefined>;
  viewMode: "aff" | "neg";
}

export const AFRowLayoutDesktop = (props: AFRowLayoutDesktopProps) => {
  const globalContext = useContext(GlobalContext);
  const [expandedColumns, setExpandedColumns] = createSignal<number[]>([0, 1]);
  const [showStatementForm, setShowStatementForm] = createSignal(false);
  const [subscribedToValueOnRelay, setSubscribedToValueOnRelay] = createSignal<
    string[]
  >([]);
  const [openingStatements, setOpeningStatements] = createSignal<Statement[]>(
    [],
  );
  const [warrantEventBeingRebutted, setWarrantEventBeingRebutted] =
    createSignal<Event | undefined>();
  const [impactEventBeingRebutted, setImpactEventBeingRebutted] = createSignal<
    Event | undefined
  >();

  const openingStatementsToShow = createMemo(() =>
    openingStatements().filter((statement) => {
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
        const previousEvent =
          "previousEvent" in content && content.previousEvent;

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

  createEffect(() => {
    if (warrantEventBeingRebutted() || impactEventBeingRebutted()) {
      setExpandedColumns([1, 0]);
    }
  });

  createEffect(() => {
    if (!expandedColumns().includes(1)) {
      setWarrantEventBeingRebutted(undefined);
      setImpactEventBeingRebutted(undefined);
    }
  });

  const toggleColumnZero = () => {
    toggleColumn(0);
  };
  const toggleColumnOne = () => {
    toggleColumn(1);
  };
  const toggleColumnTwo = () => {
    toggleColumn(2);
  };
  const toggleColumnThree = () => {
    toggleColumn(3);
  };

  return (
    <div>
      <div class="flex w-full space-x-2 px-10">
        <Column
          onMouseEnter={toggleColumnZero}
          classList={getClassNamesList(0)}
          visible={expandedColumns().includes(0)}
        >
          <div class="flex h-full flex-col justify-between">
            <div class="flex flex-col space-y-2">
              <For each={openingStatementsToShow()}>
                {(statementCWI) => (
                  <StatementCWIView
                    statement={statementCWI}
                    onWarrantRebuttalClick={() => {
                      setWarrantEventBeingRebutted((previous) =>
                        previous ? undefined : statementCWI.event,
                      );
                    }}
                    onImpactRebuttalClick={() => {
                      setImpactEventBeingRebutted((previous) =>
                        previous ? undefined : statementCWI.event,
                      );
                    }}
                  />
                )}
              </For>
            </div>
            {!showStatementForm() && (
              <AddStatementButton
                valueName={props.currentTopicValue()?.name}
                setShowStatementForm={setShowStatementForm}
              />
            )}
            {showStatementForm() && (
              <CreateStatementForm
                // TODO: Pass the accessor function instead of the value
                previousEvent={props.currentTopicValue()?.event}
                type={getType(0)}
                setShowStatementForm={setShowStatementForm}
                onCreateStatmentCWI={onCreateStatementCWI}
              />
            )}
          </div>
        </Column>
        <Column
          onMouseEnter={toggleColumnOne}
          classList={getClassNamesList(1)}
          visible={expandedColumns().includes(1)}
        >
          {warrantEventBeingRebutted() && (
            <CreateWarrantRebuttalForm
              previousEvent={warrantEventBeingRebutted}
              onCancel={() => setWarrantEventBeingRebutted(undefined)}
            />
          )}
          {impactEventBeingRebutted() && (
            <CreateImpactRebuttalForm
              previousEvent={impactEventBeingRebutted}
              onCancel={() => setImpactEventBeingRebutted(undefined)}
            />
          )}
        </Column>
        <Column
          onMouseEnter={toggleColumnTwo}
          classList={getClassNamesList(2)}
          visible={expandedColumns().includes(2)}
        >
          <span />
        </Column>
        <Column
          onMouseEnter={toggleColumnThree}
          classList={getClassNamesList(3)}
          visible={expandedColumns().includes(3)}
        >
          <span />
        </Column>
      </div>
    </div>
  );
};
