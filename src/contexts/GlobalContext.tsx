/* eslint-disable @typescript-eslint/no-empty-function */
import { Relay } from "nostr-tools";
import { ToasterStore } from "solid-headless";
import { Accessor, JSX, createContext, createSignal, onMount } from "solid-js";
import { ToastContent } from "~/components/Atoms/CustomToast";
import { Topic } from "~/components/Topics/types";

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

export interface GlobalStoreProviderType {
  connectedUser: Accessor<User | null> | null;
  relays: Accessor<RelayContainer[]> | null;
  userTopics: Accessor<Topic[]> | null;
  setConnectedUser: (user: User) => void;
  setRelayStore: ({
    name,
    newRelayContainer,
  }: {
    name: string;
    newRelayContainer: RelayContainer;
  }) => void;
  setUserTopics: (topics: Topic[]) => void;
  toasterStore: ToasterStore<ToastContent>;
  createToast: ({ message, type }: ToastContent) => void;
  highlightedEventId: Accessor<string> | null;
  setHighlightedEventId: (eventId: string | null) => void;
}

export const GlobalContext = createContext<GlobalStoreProviderType>(
  {
    connectedUser: null,
    relays: null,
    userTopics: null,
    highlightedEventId: null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setConnectedUser: (user: User) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setRelayStore: ({ name, newRelayContainer }) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setUserTopics: (topics: Topic[]) => {},
    toasterStore: new ToasterStore<ToastContent>(),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createToast: ({ message, type }: ToastContent) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setHighlightedEventId: (eventId: string | null) => {},
  },
  {},
);

const RelayStoreContext = (props: GlobalStoreContextProps) => {
  const [hasNostrInWindow, setHasNostrInWindow] = createSignal(false);
  const [connectedUser, setConnectedUser] = createSignal<User | null>(null);
  const [highlightedEventId, setHighlightedEventId] = createSignal<string>("");
  const [userTopics, setUserTopics] = createSignal<Topic[]>([]);
  const [relayStore, setRelayStore] = createSignal<RelayContainer[]>([
    {
      name: "arguflow",
      url: "wss://nostr.arguflow.gg/",
      relay: null,
      connected: false,
    },
  ]);

  const toasterStore = new ToasterStore<ToastContent>();
  const globalStoreProvider = {
    connectedUser,
    relays: relayStore,
    userTopics,
    highlightedEventId,
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
    setUserTopics,
    toasterStore,
    createToast: ({ message, type }: ToastContent) => {
      toasterStore.create({
        message,
        type,
      });
    },
    setHighlightedEventId,
  };

  onMount(() => {
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      if (typeof window !== "undefined" && (window as any).nostr) {
        setHasNostrInWindow(true);
      }
    }, 100);
  });

  return (
    <GlobalContext.Provider value={globalStoreProvider}>
      {props.children}
      {!hasNostrInWindow() && (
        <div class="fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-gray-600/20 backdrop-blur-sm">
          <div class="rounded-lg bg-black px-8 py-4 text-red-500">
            You need to install{` `}
            <a
              href="https://chrome.google.com/webstore/detail/nos2x/kpgefcfmnafjgpblomihpgmejjdanjjp"
              target="_blank"
              referrerPolicy="no-referrer"
              class="text-red-300 underline"
            >
              nos2x
            </a>
            {` `} or{` `}
            <a
              href="https://addons.mozilla.org/en-US/firefox/addon/nos2x-fox/"
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
