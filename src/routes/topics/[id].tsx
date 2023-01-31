import { createEffect, createMemo, createSignal, useContext } from "solid-js";
import { useParams } from "solid-start";
import { Topic, Value } from "~/components/Topics/types";
import ApplicationLayout from "~/components/layouts/ApplicationLayout";
import { GlobalContext, RelayContainer } from "~/contexts/GlobalContext";
import { Event } from "nostr-tools";
import { isEventArguflowTopicByTags } from "~/components/Topics/TopicsList";
import { SplitButton } from "~/components/Topics/ValueSplitButton";
import { memo } from "solid-js/web";

export const subscribeToArguflowTopicByEventId = ({
  eventId,
  connectedRelayContainers,
  onTopicReceived,
  onSubscriptionCreated,
}: {
  eventId: string;
  connectedRelayContainers: RelayContainer[];
  onTopicReceived: (topic: Event) => void;
  onSubscriptionCreated?: (relayName: string) => void;
}) => {
  connectedRelayContainers.forEach((relayContainer) => {
    if (relayContainer.relay) {
      onSubscriptionCreated && onSubscriptionCreated(relayContainer.name);
      const relay = relayContainer.relay;
      const topicSub = relay.sub(
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

      topicSub.on("event", (event: Event) => {
        const tags = event.tags;
        isEventArguflowTopicByTags(tags) && onTopicReceived(event);
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
  const [topicValues, setTopicValues] = createSignal<Value[]>([
    {
      name: "Competitive Fairness",
      description:
        "The extent to which the system is fair to all participants.",
    },
    {
      name: "Corruption Resistance",
      description: "The extent to which the system is resistant to corruption.",
    },
    {
      name: "Public Health",
      description:
        "The extent to which the system is beneficial to public health.",
    },
  ]);

  const globalContext = useContext(GlobalContext);

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
            setCurrentTopic({
              eventId: params.id,
              title: topicQuestion,
            });
          }
        },
      });
    }
  });

  return (
    <ApplicationLayout>
      <div class="mt-4 flex w-full justify-center">
        <div class="flex w-full max-w-[75%] flex-col items-center justify-center space-y-6 rounded-lg border border-slate-600 px-8 py-2">
          <div class="flex w-full items-center space-x-8">
            <div class="w-fit">
              <SplitButton
                selectedTopic={selectedTopic}
                setSelectedTopic={setSelectedTopic}
                topicValues={topicValues}
              />
            </div>
            <div class="w-fit text-center text-2xl text-white">
              {currentTopic() ? currentTopic()?.title : "Loading..."}
            </div>
          </div>
        </div>
      </div>
    </ApplicationLayout>
  );
};

export default TopicDetail;
