import { useContext, For } from "solid-js";
import { GlobalContext, RelayContainer } from "~/contexts/GlobalContext";
import { Event } from "nostr-tools";
import { A } from "solid-start";

export const isEventArguflowTopicByTags = (tags: string[][]): boolean => {
  let foundArguflow = false;
  let foundArguflowTopicQuestion = false;
  tags.forEach((tag) => {
    if (tag[0] === "arguflow") foundArguflow = true;
    if (tag[0] === "arguflow-topic-question") foundArguflowTopicQuestion = true;
  });

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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

  if (
    globalContext.relays &&
    globalContext.connectedUser &&
    globalContext.connectedUser()?.publicKey
  ) {
    const connectedRelayContainers = globalContext
      .relays()
      .filter((relay) => relay.connected);
    const userPublicKey = globalContext.connectedUser()?.publicKey;

    if (userPublicKey) {
      subscribeToArguflowTopicsForPublickKey({
        publicKey: userPublicKey,
        connectedRelayContainers: connectedRelayContainers,
        onTopicReceived: (topicEvent: Event) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const content = JSON.parse(topicEvent.content);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const topicQuestion = content.topicQuestion;
          const eventId = topicEvent.id;

          const currentUserTopics = globalContext.userTopics?.();
          if (currentUserTopics?.find((topic) => topic.eventId === eventId))
            return;

          if (topicQuestion && typeof topicQuestion === "string" && eventId) {
            globalContext.userTopics?.() &&
              globalContext.setUserTopics([
                ...globalContext.userTopics(),
                {
                  eventId: eventId,
                  title: topicQuestion,
                },
              ]);
          }
        },
      });
    }
  }

  return (
    <div class="flex w-full flex-col items-center justify-center space-y-2 px-2">
      <For each={globalContext.userTopics?.()}>
        {(topic) => {
          return (
            <div class="w-full rounded-lg bg-gray-800">
              <A
                href={`/topics/${topic.eventId}`}
                aria-label="topic detail page"
              >
                <div class="p-4 text-lg font-bold text-white">
                  {topic.title}
                </div>
              </A>
            </div>
          );
        }}
      </For>
      {!globalContext.userTopics?.().length && (
        <div class="w-full text-center text-lg font-bold text-white">
          You have no topics yet
        </div>
      )}
    </div>
  );
};

export default TopicsList;
