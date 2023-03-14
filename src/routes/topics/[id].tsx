import {
  createEffect,
  createSignal,
  useContext,
  For,
  Show,
  createMemo,
} from "solid-js";
import { useParams } from "solid-start";
import { Topic, TopicValue } from "~/components/Topics/types";
import ApplicationLayout from "~/components/layouts/ApplicationLayout";
import { GlobalContext, RelayContainer } from "~/contexts/GlobalContext";
import { Event, getEventHash } from "nostr-tools";
import { isEventArguflowTopicByTags } from "~/components/Topics/TopicsList";
import ValueSplitButton from "~/components/Topics/ValueSplitButton";
import { getUTCSecondsSinceEpoch } from "~/components/Topics/TopicsDisplay";
import { emitEventToConnectedRelays } from "~/nostr-types";
import CreateValueForm from "~/components/Topics/CreateValueForm";
import { Toaster, useToaster } from "solid-headless";
import { CustomToast } from "~/components/Atoms/CustomToast";
import { AFRowLayoutDesktop } from "~/components/layouts/AFRowLayoutDesktop";
import { HiOutlineSwitchVertical } from "solid-icons/hi";
import NostrUserName from "~/components/Atoms/NostrUserName";

export const isEventArguflowValueByTags = (tags: string[][]): boolean => {
  return (
    tags.some((tag) => tag[0] === "arguflow") &&
    tags.some((tag) => tag[0] === "arguflow-topic-value")
  );
};

export const subscribeToArguflowTopicByEventId = ({
  eventId,
  connectedRelayContainers,
  onTopicReceived,
  onValueReceived,
}: {
  eventId: string;
  connectedRelayContainers: RelayContainer[];
  onTopicReceived: (topic: Event) => void;
  onValueReceived: (value: Event) => void;
}) => {
  connectedRelayContainers.forEach((relayContainer) => {
    if (!relayContainer.relay) {
      return;
    }
    const relay = relayContainer.relay;
    const topicEventSub = relay.sub(
      [
        {
          ids: [eventId],
          kinds: [40],
        },
      ],
      {
        skipVerification: true,
      },
    );

    topicEventSub.on("event", (event: Event) => {
      const tags = event.tags;
      isEventArguflowTopicByTags(tags) && onTopicReceived(event);
    });

    topicEventSub.on("eose", () => {
      topicEventSub.unsub();
    });

    const topicRepliesEventSub = relay.sub(
      [
        {
          kinds: [42],
          ["#e"]: [eventId],
        },
      ],
      {
        skipVerification: true,
      },
    );

    topicRepliesEventSub.on("event", (event: Event) => {
      const tags = event.tags;
      isEventArguflowValueByTags(tags) && onValueReceived(event);
    });
  });
};

const TopicDetail = () => {
  const [currentTopic, setCurrentTopic] = createSignal<Topic | null>(null);
  const [selectedTopic, setSelectedTopic] = createSignal<number>(0);
  const [topicValues, setTopicValues] = createSignal<TopicValue[]>([]);
  const [showCreateValueForm, setShowCreateValueForm] =
    createSignal<boolean>(false);
  const [firstRow, setFirstRow] = createSignal<"aff" | "neg">("aff");

  const [topicPubKeys, setTopicPubKeys] = createSignal<string[]>([]);

  const currentTopicValue = createMemo(() => {
    if (topicValues().length == 0) {
      return undefined;
    }
    return topicValues()[selectedTopic()];
  });

  const globalContext = useContext(GlobalContext);
  const notifs = useToaster(globalContext.toasterStore);

  const params = useParams<{ id: string }>();

  const addPubKey = (pubkey: string) => {
    const currentPubKeys = topicPubKeys();
    if (!currentPubKeys.includes(pubkey)) {
      setTopicPubKeys([...currentPubKeys, pubkey]);
    }
  };

  createEffect(() => {
    if (!globalContext.relays?.().find((relay) => relay.connected)) {
      return;
    }

    const connectedRelayContainers = globalContext
      .relays()
      .filter((relay) => relay.connected);

    subscribeToArguflowTopicByEventId({
      eventId: params.id,
      connectedRelayContainers: connectedRelayContainers,
      onTopicReceived: (topic) => {
        if (!topicPubKeys().includes(topic.pubkey)) {
          setTopicPubKeys([...topicPubKeys(), topic.pubkey]);
        }
        addPubKey(topic.pubkey);
        const content: unknown = JSON.parse(topic.content);
        if (typeof content !== "object" || !content) return;
        const topicQuestion = "name" in content && content.name;
        if (!topicQuestion || typeof topicQuestion !== "string") return;

        if (!topicQuestion) return;
        if (!topicQuestion || typeof topicQuestion !== "string") return;

        if (currentTopic()?.event.id === params.id) {
          return;
        }

        setCurrentTopic({
          event: topic,
          title: topicQuestion,
          pubkey: topic.pubkey,
        });
      },
      onValueReceived: (value) => {
        addPubKey(value.pubkey);

        const content: unknown = JSON.parse(value.content);
        if (typeof content !== "object" || !content) return;
        const valueName = "name" in content && content.name;
        if (!valueName || typeof valueName !== "string") return;
        const valueDescription =
          "description" in content && content.description;
        if (!valueDescription || typeof valueDescription !== "string") return;

        if (topicValues().find((topicValue) => topicValue.name === valueName))
          return;

        setTopicValues((current) => [
          ...current,
          {
            name: valueName,
            description: valueDescription,
            event: value,
          },
        ]);
      },
    });
  });

  const onCreateValue = ({ name, description }: TopicValue) => {
    const eventPublicKey = globalContext.connectedUser?.()?.publicKey;
    const topicEventId = params.id;

    if (!eventPublicKey || !topicEventId) return;

    if (!name) {
      globalContext.createToast({
        message: "Name is required to create a value",
        type: "error",
      });
      return;
    }

    const createdAt = getUTCSecondsSinceEpoch();
    const event: Event = {
      id: "",
      sig: "",
      kind: 42,
      pubkey: eventPublicKey,
      tags: [
        ["arguflow"],
        ["arguflow-topic-value"],
        ["e", topicEventId, "nostr.arguflow.gg", "root"],
      ],
      created_at: createdAt,
      content: JSON.stringify({
        name: name,
        description: description,
        topicEventId: topicEventId,
      }),
    };
    event.id = getEventHash(event);

    addPubKey(eventPublicKey);
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
      setShowCreateValueForm(false);
      globalContext.createToast({
        message: name + " value created successfully",
        type: "success",
      });
    });
  };

  const affRow = createMemo(() => {
    if (!currentTopic()) return;
    return (
      <AFRowLayoutDesktop
        currentTopicValue={currentTopicValue}
        topic={currentTopic}
        addPubKey={addPubKey}
        viewMode="aff"
      />
    );
  });

  const negRow = createMemo(() => {
    if (!currentTopic()) return;
    return (
      <AFRowLayoutDesktop
        currentTopicValue={currentTopicValue}
        addPubKey={addPubKey}
        topic={currentTopic}
        viewMode="neg"
      />
    );
  });

  const rows = createMemo(() => {
    const currentFirstRow = firstRow();

    const affRowComponent = affRow();
    const negRowComponent = negRow();

    if (!affRowComponent || !negRowComponent) return;

    if (currentFirstRow === "aff") {
      return <>{affRowComponent}</>;
    } else {
      return <>{negRowComponent}</>;
    }
  });

  return (
    <ApplicationLayout>
      <div class="flex flex-col space-y-4 px-4 py-2 md:px-8 md:py-4">
        <div class="mt-4 flex w-full justify-center">
          <div class="flex w-full flex-col items-center justify-center space-y-6 rounded-lg border border-emerald-300 dark:border-slate-600 p-2 md:px-8 md:py-4">
            <div class="flex w-full flex-wrap items-center justify-center space-x-4 space-y-2 md:justify-between md:space-x-6 ">
              <div class="md:min-w-[30%] md:max-w-[40%]">
                <ValueSplitButton
                  selectedTopic={selectedTopic}
                  setSelectedTopic={setSelectedTopic}
                  topicValues={topicValues}
                  showCreateValueForm={showCreateValueForm}
                  setShowCreateValueForm={setShowCreateValueForm}
                />
              </div>
              <div class="text-center text-2xl text-indigo-700 dark:text-white md:max-w-[40%]">
                {currentTopic() ? (
                  currentTopic()?.title
                ) : (
                  <span class="animate-pulse">"Loading..."</span>
                )}
              </div>
              <div
                classList={{
                  "flex flex-row justify-center": true,
                  "text-emerald-500": firstRow() === "aff",
                  "text-rose-500": firstRow() === "neg",
                }}
              >
                <button
                  onClick={() =>
                    setFirstRow((current) =>
                      current === "aff" ? "neg" : "aff",
                    )
                  }
                  classList={{
                    "w-fit border-2 rounded-xl p-1": true,
                    "border-emerald-500": firstRow() === "aff",
                    "border-rose-500": firstRow() === "neg",
                  }}
                >
                  <HiOutlineSwitchVertical class="h-8 w-8" />
                </button>
              </div>
              <div class="flex flex-col text-indigo-700 dark:text-white">
                <p class="font-bold">Authors:</p>
                <For each={topicPubKeys()}>
                  {(pubkey) => {
                    return <NostrUserName pubkey={pubkey} />;
                  }}
                </For>
              </div>
            </div>
            {showCreateValueForm() && (
              <CreateValueForm
                onCreateValue={onCreateValue}
                onCancel={() => setShowCreateValueForm(false)}
              />
            )}
          </div>
        </div>
        {rows()}
      </div>
      <Toaster class="fixed-0 absolute left-0 bottom-0 m-4">
        <Show when={notifs().length > 0}>
          <For each={notifs().slice(0).reverse()}>
            {(item) => {
              return (
                <CustomToast
                  id={item.id}
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                  message={item.data.message}
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                  type={item.data.type}
                />
              );
            }}
          </For>
        </Show>
      </Toaster>
    </ApplicationLayout>
  );
};

export default TopicDetail;
