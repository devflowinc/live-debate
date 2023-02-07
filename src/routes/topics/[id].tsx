import { createEffect, createSignal, useContext, For, Show } from "solid-js";
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
import { CustomToast, ToastContent } from "~/components/Atoms/CustomToast";
import { AFRowLayoutDesktop } from "~/components/layouts/AFRowLayoutDesktop";

export const isEventArguflowValueByTags = (tags: string[][]): boolean => {
  let foundArguflow = false;
  let foundArguflowTopicValue = false;
  tags.forEach((tag) => {
    if (tag[0] === "arguflow") foundArguflow = true;
    if (tag[0] === "arguflow-topic-value") foundArguflowTopicValue = true;
  });

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return foundArguflow && foundArguflowTopicValue;
};

export const subscribeToArguflowTopicByEventId = ({
  eventId,
  connectedRelayContainers,
  onTopicReceived,
  onValueReceived,
  onSubscriptionCreated,
}: {
  eventId: string;
  connectedRelayContainers: RelayContainer[];
  onTopicReceived: (topic: Event) => void;
  onValueReceived: (value: Event) => void;
  onSubscriptionCreated?: (relayName: string) => void;
}) => {
  connectedRelayContainers.forEach((relayContainer) => {
    if (relayContainer.relay) {
      onSubscriptionCreated?.(relayContainer.name);
      const relay = relayContainer.relay;
      const topicEventSub = relay.sub(
        [
          {
            ids: [eventId],
            kinds: [1],
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

      const topicRepliesEventSub = relay.sub(
        [
          {
            kinds: [1],
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
    }
  });
};

const TopicDetail = () => {
  const [currentTopic, setCurrentTopic] = createSignal<Topic | null>(null);
  const [selectedTopic, setSelectedTopic] = createSignal<number>(0);
  const [subscribedToTopicOnRelay, setSubscribedToTopicOnRelay] = createSignal<
    string[]
  >([]);
  const [topicValues, setTopicValues] = createSignal<TopicValue[]>([]);
  const [showCreateValueForm, setShowCreateValueForm] =
    createSignal<boolean>(false);

  const globalContext = useContext(GlobalContext);
  const notifs = useToaster(globalContext.toasterStore);

  const createToast = ({ message, type }: ToastContent) => {
    globalContext.toasterStore.create({
      message,
      type,
    });
  };

  const params = useParams<{ id: string }>();

  createEffect(() => {
    if (globalContext.relays?.().find((relay) => relay.connected)) {
      const connectedRelayContainers = globalContext
        .relays()
        .filter((relay) => relay.connected);
      const unusedConnectedRelayContainers = connectedRelayContainers.filter(
        (relay) =>
          !subscribedToTopicOnRelay().find(
            (relayName) => relayName === relay.name,
          ),
      );

      subscribeToArguflowTopicByEventId({
        eventId: params.id,
        connectedRelayContainers: unusedConnectedRelayContainers,
        onSubscriptionCreated: (relayName) => {
          setSubscribedToTopicOnRelay((current) => [...current, relayName]);
        },
        onTopicReceived: (topic) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const content = JSON.parse(topic.content);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const topicQuestion = content.topicQuestion;
          if (topicQuestion && typeof topicQuestion === "string") {
            if (currentTopic()?.eventId === params.id) return;

            setCurrentTopic({
              eventId: params.id,
              title: topicQuestion,
            });
          }
        },
        onValueReceived: (value) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const content = JSON.parse(value.content);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const valueName = content.name;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const valueDescription = content.description;
          if (
            valueName &&
            typeof valueName === "string" &&
            typeof valueDescription === "string"
          ) {
            if (
              topicValues().find((topicValue) => topicValue.name === valueName)
            )
              return;

            setTopicValues((current) => [
              ...current,
              {
                name: valueName,
                description: valueDescription,
              },
            ]);
          }
        },
      });
    }
  });

  const onCreateValue = ({ name, description }: TopicValue) => {
    const eventPublicKey = globalContext.connectedUser?.()?.publicKey;
    const topicEventId = currentTopic()?.eventId;

    if (!eventPublicKey || !topicEventId) return;

    if (!name) {
      createToast({
        message: "Name is required to create a value",
        type: "error",
      });
      return;
    }

    const createdAt = getUTCSecondsSinceEpoch();

    const event: Event = {
      id: "",
      sig: "",
      kind: 1,
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
      createToast({
        message: name + " value created successfully",
        type: "success",
      });
    });
  };

  return (
    <ApplicationLayout>
      <div class="flex flex-col space-y-4">
        <div class="mt-4 flex w-full justify-center">
          <div class="flex w-full max-w-[75%] flex-col items-center justify-center space-y-6 rounded-lg border border-slate-600 px-8 py-4">
            <div class="flex w-full items-center space-x-8">
              <div class="min-w-[30%] max-w-[50%]">
                <ValueSplitButton
                  selectedTopic={selectedTopic}
                  setSelectedTopic={setSelectedTopic}
                  topicValues={topicValues}
                  showCreateValueForm={showCreateValueForm}
                  setShowCreateValueForm={setShowCreateValueForm}
                />
              </div>
              <div class="max-w-[50%] text-center text-2xl text-white">
                {currentTopic() ? currentTopic()?.title : "Loading..."}
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
        <AFRowLayoutDesktop topicId="fdsa" viewMode="aff"/>
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
