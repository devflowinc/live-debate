// This component should be a green circle in the top right when connected to a relay
// Red circle when not connected

import { Relay, relayInit } from "nostr-tools";
import { createSignal, onMount } from "solid-js";

interface RelayContainer {
  name: string;
  url: string;
  relay: Relay | null;
  connected: boolean;
}

const ConnectedIndicator = () => {
  const [supportedRelays, setSupportedRelays] = createSignal<RelayContainer[]>(
    [
      {
        name: "brb",
        url: "wss://brb.io/",
        relay: null,
        connected: false,
      },
      {
        name: "klendazu",
        url: "wss://btc.klendazu.com/",
        relay: null,
        connected: false,
      },
      {
        name: "deschooling",
        url: "wss://deschooling.us/",
        relay: null,
        connected: false,
      },
    ],
    { equals: false }
  );

  onMount(() => {
    supportedRelays().forEach((relayContainer) => {
      const initializedRelay = relayInit(relayContainer.url);

      initializedRelay.on("connect", () => {
        setSupportedRelays((prev) => {
          return prev.map((relay) => {
            if (relay.name === relayContainer.name) {
              return {
                ...relay,
                connected: true,
              };
            }
            return relay;
          });
        });
        relayContainer.connected = true;
      });
      initializedRelay.on("disconnect", () => {
        setSupportedRelays((prev) => {
          return prev.map((relay) => {
            if (relay.name === relayContainer.name) {
              return {
                ...relay,
                connected: false,
              };
            }
            return relay;
          });
        });
      });
      initializedRelay.on("error", () => {
        console.error(`Error connecting to ${relayContainer.url} relay`);
      });
      initializedRelay.connect();

      setSupportedRelays((prev) => {
        return prev.map((relay) => {
          if (relay.name === relayContainer.name) {
            return {
              ...relay,
              relay: initializedRelay,
            };
          }
          return relay;
        });
      });
    });
  });

  return (
    <div class="w-fit h-fit">
      <div
        class={`w-4 h-4 rounded-full animate-pulse ${
          supportedRelays().find((relay) => relay.connected)
            ? "bg-green-500"
            : "bg-red-500"
        }`}
      ></div>
    </div>
  );
};

export default ConnectedIndicator;
