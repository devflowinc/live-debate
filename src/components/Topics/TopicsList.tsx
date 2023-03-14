import { useContext, For, createEffect } from "solid-js";
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

export const subscribeToArguflowTopicsForPublicKey = ({
  publicKey,
  connectedRelayContainers,
  onTopicReceived,
}: {
  publicKey: string;
  connectedRelayContainers: RelayContainer[];
  onTopicReceived: (topic: Event) => void;
}) => {
  connectedRelayContainers.forEach((relayContainer) => {
    if (!relayContainer.relay) return;

    const relay = relayContainer.relay;
    const topicsSub = relay.sub(
      [
        {
          authors: [publicKey],
          kinds: [40],
        },
      ],
      {
        skipVerification: true,
      },
    );

    topicsSub.on("event", (event: Event) => {
      const tags = event.tags;
      isEventArguflowTopicByTags(tags) && onTopicReceived(event);
    });
  });
};

const TopicsList = () => {
  const globalContext = useContext(GlobalContext);

  createEffect(() => {
    if (
      globalContext.relays &&
      globalContext.connectedUser &&
      globalContext.connectedUser()?.publicKey
    ) {
      const connectedRelayContainers = globalContext
        .relays()
        .filter((relay) => relay.connected);
      const userPublicKey = globalContext.connectedUser()?.publicKey;
      if (!userPublicKey) return;

      subscribeToArguflowTopicsForPublicKey({
        publicKey: userPublicKey,
        connectedRelayContainers: connectedRelayContainers,
        onTopicReceived: (topicEvent: Event) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const content = JSON.parse(topicEvent.content);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const topicQuestion = content.name;

          const currentUserTopics = globalContext.userTopics?.();
          if (
            currentUserTopics?.find((topic) => topic.event.id === topicEvent.id)
          )
            return;

          if (topicQuestion && typeof topicQuestion === "string") {
            const currentUserTopics = globalContext.userTopics?.();
            if (Array.isArray(currentUserTopics)) {
              globalContext.setUserTopics([
                {
                  event: topicEvent,
                  title: topicQuestion,
                },
                ...currentUserTopics,
              ]);
            }
          }
        },
      });
    }
  });

  return (
    <div class="flex w-full flex-col items-center justify-center space-y-2 px-2">
      <For each={globalContext.userTopics?.()}>
        {(topic) => {
          return (
            <div class="w-full rounded-lg bg-emerald-200 dark:bg-gray-800">
              <A
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                href={`/topics/${topic.event.id}`}
                aria-label="topic detail page"
              >
                <div class="p-4 text-lg font-bold text-blue-600 dark:text-white border rounded-lg border-violet-400">
                  {topic.title}
                </div>
              </A>
            </div>
          );
        }}
      </For>
      {!globalContext.userTopics?.().length && (
        <div class="w-full text-center text-lg font-bold text-blue-600 dark:text-white">
          You have no topics yet
        </div>
      )}
    </div>
  );
};

export default TopicsList;
