import { createEffect, createSignal, onCleanup, useContext } from "solid-js";
import { GlobalContext } from "~/contexts/GlobalContext";
import { NostrUserMetadata } from "~/nostr-types";
import { Event } from "nostr-tools";
import { CgProfile } from "solid-icons/cg";

export interface NostrUserNameProps {
  pubkey: string;
}

const NostrUserName = (props: NostrUserNameProps) => {
  const globalContext = useContext(GlobalContext);
  const [userName, setUserName] = createSignal<string | undefined>(undefined);
  const [userImage, setUserImage] = createSignal<string | undefined>(undefined);

  createEffect(() => {
    if (!globalContext.relays?.().find((relay) => relay.connected)) {
      return;
    }
    const connectedRelayContainers = globalContext
      .relays()
      .filter((relay) => relay.connected);

    const metadataSubs = connectedRelayContainers.map((relayContainer) => {
      if (!relayContainer.relay) {
        return;
      }

      const relay = relayContainer.relay;
      const metadataSub = relay.sub(
        [
          {
            authors: [props.pubkey],
            kinds: [0],
          },
        ],
        {
          skipVerification: true,
        },
      );

      metadataSub.on("event", (event: Event) => {
        const metadata = JSON.parse(event.content) as NostrUserMetadata;
        setUserName(metadata.name);
        setUserImage(metadata.picture);
      });

      metadataSub.on("eose", () => {
        metadataSub.unsub();
      });
      return metadataSub;
    });

    onCleanup(() => {
      metadataSubs.forEach((subscription) => subscription?.unsub());
    });
  });

  return (
    <div class="flex items-center space-x-1">
      {userImage() ? <img class="h-8 w-8" src={userImage()} /> : <CgProfile />}
      {userName() && <span>{userName()}</span>}
      {!userName() && (
        <span>
          {props.pubkey.slice(0, 3)}... {props.pubkey.slice(-3)}
        </span>
      )}
    </div>
  );
};

export default NostrUserName;
