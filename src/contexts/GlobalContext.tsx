import { Relay } from "nostr-tools";
import { Accessor, JSX, createContext, createSignal, onMount } from "solid-js";

export interface RelayContainer {
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
      name: "damus",
      url: "wss://relay.damus.io/",
      relay: null,
      connected: false,
    },
    {
      name: "wlvs",
      url: "wss://nostr-relay.wlvs.space/",
      relay: null,
      connected: false,
    },
    {
      name: "wellorder",
      url: "wss://nostr-pub.wellorder.net/",
      relay: null,
      connected: false,
    }, 
    {
      name: "walletofsatoshi",
      url: "wss://nostr.walletofsatoshi.com/",
      relay: null,
      connected: false,
    },
    {
      name: "bitcoiner.social",
      url: "wss://nostr.bitcoiner.social/",
      relay: null,
      connected: false,
    },
    {
      name: "zebedee",
      url: "wss://nostr.zebedee.cloud/",
      relay: null,
      connected: false,
    },
    {
      name: "onsats",
      url: "wss://nostr.onsats.org/",
      relay: null,
      connected: false,
    },
    {
      name: "nostr.info",
      url: "wss://nostr.info/",
      relay: null,
      connected: false,
    },
    {
      name: "semisol",
      url: "wss://nostr-pub.semisol.dev/",
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
      {!hasNostrInWindow() && (
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
