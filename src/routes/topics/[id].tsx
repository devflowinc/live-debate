import { createSignal, useContext } from "solid-js";
import { useParams } from "solid-start";
import { Topic } from "~/components/Topics/types";
import ApplicationLayout from "~/components/layouts/ApplicationLayout";
import { GlobalContext, RelayContainer } from "~/contexts/GlobalContext";
import { Event } from "nostr-tools";
import { isEventArguflowTopicByTags } from "~/components/Topics/TopicsList";

export const subscribeToArguflowTopicByEventId = ({
  eventId,
  connectedRelayContainers,
  onTopicReceived,
}: {
  eventId: string;
  connectedRelayContainers: RelayContainer[];
  onTopicReceived: (topic: Event) => void;
}) => {
  connectedRelayContainers.forEach((relayContainer) => {
    if (relayContainer.relay) {
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

  const globalContext = useContext(GlobalContext);

  const params = useParams<{ id: string }>();

  if (globalContext && globalContext.relays) {
    const connectedRelayContainers = globalContext
      .relays()
      .filter((relay) => relay.connected);

    subscribeToArguflowTopicByEventId({
      eventId: params.id,
      connectedRelayContainers: connectedRelayContainers,
      onTopicReceived: (topic) => {
        const content = JSON.parse(topic.content);
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

  return (
    <ApplicationLayout>
      <div class="mt-4">
        <h1 class="w-full text-center text-white">
          Topic Detail: {currentTopic() ? currentTopic()?.title : "Loading..."}
        </h1>
      </div>
    </ApplicationLayout>
  );
};

export default TopicDetail;
