// This component should be a green circle in the top right when connected to a relay
// Red circle when not connected
import { relayInit } from "nostr-tools";
import { createEffect, onMount, useContext } from "solid-js";
import { RelayContext } from "~/contexts/RelayStoreContext";

const ConnectedIndicator = () => {
  const relayContextStore = useContext(RelayContext);

  createEffect(() => {}, relayContextStore);

  onMount(() => {
    relayContextStore.relays &&
      relayContextStore.relays().forEach((relayContainerOld) => {
        const relayContainer = { ...relayContainerOld };

        const initializedRelay = relayInit(relayContainer.url);

        initializedRelay.on("connect", () => {
          relayContainer.connected = true;
          relayContextStore.setRelayStore({
            name: relayContainer.name,
            newRelayContainer: relayContainer,
          });
        });
        initializedRelay.on("disconnect", () => {
          relayContainer.connected = false;
          relayContextStore.setRelayStore({
            name: relayContainer.name,
            newRelayContainer: relayContainer,
          });
        });
        initializedRelay.on("error", () => {
          console.error(`Error connecting to ${relayContainer.url} relay`);
        });

        initializedRelay.connect();
      });
  });

  return (
    <div class="w-fit h-fit">
      <div
        class={`w-4 h-4 rounded-full animate-pulse ${
          relayContextStore.relays &&
          relayContextStore.relays().find((relay) => relay.connected)
            ? "bg-green-500"
            : "bg-red-500"
        }`}
      ></div>
    </div>
  );
};

export default ConnectedIndicator;
