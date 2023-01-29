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
        }
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
    <div class="w-full px-2 flex flex-col items-center justify-center">
      {userTopics().map((topic) => {
        return (
          <div class="w-full bg-gray-800 rounded-lg p-4 my-2">
            <div class="text-white text-lg font-bold">{topic.title}</div>
          </div>
        );
      })}
    </div>
  );
};

export default TopicsList;
