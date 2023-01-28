import { Relay } from "nostr-tools";
import { Accessor, JSX, createContext, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

interface RelayContainer {
  name: string;
  url: string;
  relay: Relay | null;
  connected: boolean;
}

export interface RelayStoreContextProps {
  children: JSX.Element;
}

export type RelayStoreProviderType = {
  relays: Accessor<RelayContainer[]> | null;
  setRelayStore: ({
    name,
    newRelayContainer,
  }: {
    name: string;
    newRelayContainer: RelayContainer;
  }) => void;
};

export const RelayContext = createContext<RelayStoreProviderType>(
  {
    relays: null,
    setRelayStore: ({ name, newRelayContainer }) => {},
  },
  {}
);

const RelayStoreContext = (props: RelayStoreContextProps) => {
  const [relayStore, setRelayStore] = createSignal<RelayContainer[]>([
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
  ]);

  const relayStoreProvider = {
    relays: relayStore,
    setRelayStore: ({
      name,
      newRelayContainer,
    }: {
      name: string;
      newRelayContainer: RelayContainer;
    }) => {
      setRelayStore((value) => {
        return value.map((relay) => {
          if (relay.name === name) {
            return newRelayContainer;
          }
          return relay;
        });
      });
    },
  };

  return (
    <RelayContext.Provider value={relayStoreProvider}>
      {props.children}
    </RelayContext.Provider>
  );
};

export default RelayStoreContext;
