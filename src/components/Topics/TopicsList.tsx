import { createSignal, useContext } from "solid-js";
import { GlobalContext, RelayContainer } from "~/contexts/GlobalContext";
import { Event } from "nostr-tools";
import { Topic } from "./types";

export const isEventArguflowTopicByTags = (tags: string[][]): boolean => {
  let foundArguflow = false;
  let foundArguflowTopicQuestion = false;
  tags.forEach((tag) => {
    if (tag[0] === "arguflow") foundArguflow = true;
    if (tag[0] === "arguflow-topic-question") foundArguflowTopicQuestion = true;
  });

  return foundArguflow && foundArguflowTopicQuestion;
};

export const subscribeToArguflowTopicsForPublickKey = ({
  publicKey,
  connectedRelayContainers,
  onTopicReceived,
}: {
  publicKey: string;
  connectedRelayContainers: RelayContainer[];
  onTopicReceived: (topic: Event) => void;
}) => {
  connectedRelayContainers.forEach((relayContainer) => {
    if (relayContainer.relay) {
      const relay = relayContainer.relay;
      const metadataSub = relay.sub(
        [
          {
            authors: [publicKey],
            kinds: [1],
          },
        ],
        {
          skipVerification: true,
        },
      );

      metadataSub.on("event", (event: Event) => {
        const tags = event.tags;
        isEventArguflowTopicByTags(tags) && onTopicReceived(event);
      });
    }
  });
};

const TopicsList = () => {
  const globalContext = useContext(GlobalContext);
  const [userTopics, setUserTopics] = createSignal<Topic[]>([]);

  const userPublicKey =
    globalContext &&
    globalContext.connectedUser &&
    globalContext.connectedUser()?.publicKey;
  if (globalContext && globalContext.relays && userPublicKey) {
    const connectedRelayContainers = globalContext
      .relays()
      .filter((relay) => relay.connected);
    subscribeToArguflowTopicsForPublickKey({
      publicKey: userPublicKey,
      connectedRelayContainers: connectedRelayContainers,
      onTopicReceived: (topicEvent: Event) => {
        const content = JSON.parse(topicEvent.content);
        const topicQuestion = content.topicQuestion;
        const eventId = topicEvent.id;

        if (topicQuestion && typeof topicQuestion === "string" && eventId) {
          setUserTopics([
            ...userTopics(),
            {
              eventId: eventId,
              title: topicQuestion,
            },
          ]);
        }
      },
    });
  }

  return (
    <div class="flex w-full flex-col items-center justify-center px-2">
      {userTopics().map((topic) => {
        return (
          <div class="my-2 w-full rounded-lg bg-gray-800 p-4">
            <div class="text-lg font-bold text-white">{topic.title}</div>
          </div>
        );
      })}
    </div>
  );
};

export default TopicsList;
