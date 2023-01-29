import { Relay } from "nostr-tools";
import { Accessor, JSX, createContext, createSignal, onMount } from "solid-js";
import { Portal } from "solid-js/web";

interface RelayContainer {
  name: string;
  url: string;
  relay: Relay | null;
  connected: boolean;
}

export interface User {
  publicKey: string;
  privateKey?: string;
  name?: string;
  email?: string;
  avatar?: string;
  about?: string;
  relays?: string[];
}

export interface GlobalStoreContextProps {
  children: JSX.Element;
}

export type GlobalStoreProviderType = {
  connectedUser: Accessor<User | null> | null;
  relays: Accessor<RelayContainer[]> | null;
  setConnectedUser: (user: User) => void;
  setRelayStore: ({
    name,
    newRelayContainer,
  }: {
    name: string;
    newRelayContainer: RelayContainer;
  }) => void;
};

export const GlobalContext = createContext<GlobalStoreProviderType>(
  {
    connectedUser: null,
    relays: null,
    setConnectedUser: (user: User) => {},
    setRelayStore: ({ name, newRelayContainer }) => {},
  },
  {}
);

const RelayStoreContext = (props: GlobalStoreContextProps) => {
  const [hasNostrInWindow, setHasNostrInWindow] = createSignal(false);
  const [connectedUser, setConnectedUser] = createSignal<User | null>(null);
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

  const globalStoreProvider = {
    connectedUser,
    relays: relayStore,
    setConnectedUser: (user: User) => {
      setConnectedUser(user);
    },
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

  onMount(() => {
    setTimeout(() => {
      if (typeof window !== "undefined" && (window as any).nostr) {
        setHasNostrInWindow(true);
      }
    }, 100);
  });

  return (
    <GlobalContext.Provider value={globalStoreProvider}>
      {props.children}
      {!hasNostrInWindow && (
        <div class="w-screen h-screen bg-gray-600/20 backdrop-blur-sm fixed top-0 left-0 flex justify-center items-center">
          <div class="px-8 py-4 bg-black rounded-lg text-red-500 max-w-[70%]">
            You need to install{` `}
            <a
              href="https://github.com/fiatjaf/nos2x"
              target="_blank"
              referrerPolicy="no-referrer"
              class="text-red-300 underline"
            >
              nos2x
            </a>
            {` `} or{` `}
            <a
              href="https://diegogurpegui.com/nos2x-fox/"
              target="_blank"
              referrerPolicy="no-referrer"
              class="text-red-300 underline"
            >
              nos2x-fox
            </a>
            {` `} to use this app.
          </div>
        </div>
      )}
    </GlobalContext.Provider>
  );
};

export default RelayStoreContext;
