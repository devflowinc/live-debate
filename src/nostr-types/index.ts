import { RelayContainer } from "~/contexts/GlobalContext";
import { Event } from "nostr-tools";

export interface NostrUserMetadata {
  name: string;
  nip05: string;
  picture: string;
}

export const emitEventToConnectedRelays = ({
  event,
  connectedRelayContainers,
}: {
  event: Event;
  connectedRelayContainers: RelayContainer[];
}) => {
  connectedRelayContainers.forEach((relayContainer) => {
    if (relayContainer.relay) {
      relayContainer.relay.publish(event);
    }
  });
};
