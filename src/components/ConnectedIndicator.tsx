// This component should be a green circle in the top right when connected to a relay
// Red circle when not connected
import { relayInit } from "nostr-tools";
import { onCleanup, onMount, useContext } from "solid-js";
import { GlobalContext } from "../contexts/GlobalContext";

const ConnectedIndicator = () => {
  const relayContextStore = useContext(GlobalContext);

  onMount(() => {
    relayContextStore.relays?.().forEach((relayContainerOld) => {
      const relayContainer = { ...relayContainerOld };

      if (relayContainer.relay) {
        return;
      }

      const initializedRelay = relayInit(relayContainer.url);

      initializedRelay.on("connect", () => {
        relayContainer.connected = true;
        relayContainer.relay = initializedRelay;
        relayContextStore.setRelayStore({
          name: relayContainer.name,
          newRelayContainer: relayContainer,
        });
      });
      initializedRelay.on("disconnect", () => {
        relayContainer.connected = false;
        relayContainer.relay = null;
        relayContextStore.setRelayStore({
          name: relayContainer.name,
          newRelayContainer: relayContainer,
        });
      });

      initializedRelay.on("error", () => {
        console.error(`Error connecting to ${relayContainer.url} relay`);
      });

      void initializedRelay.connect();
    });

    onCleanup(() => {
      relayContextStore.relays?.().forEach((relayContainer) => {
        void relayContainer.relay?.close();
      });
    });
  });

  return (
    <div class="h-fit w-fit">
      <div
        class={`h-4 w-4 animate-pulse rounded-full ${
          relayContextStore.relays?.().find((relay) => relay.connected)
            ? "bg-green-500"
            : "bg-red-500"
        }`}
      />
    </div>
  );
};

export default ConnectedIndicator;
