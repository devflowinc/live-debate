import { useContext } from "solid-js";
import ConnectedIndicator from "../ConnectedIndicator";
import ConnectIdButton from "./ConnectIdButton";
import { GlobalContext } from "~/contexts/GlobalContext";
import NostrUserPreview from "./NostrUserPreview";
import { A } from "solid-start";

const Navbar = () => {
  const globalStore = useContext(GlobalContext);

  return (
    <div class="flex w-full items-center justify-between border-b border-gray-800 bg-transparent px-16 py-4">
      <A href="/" class="text-2xl text-white">
        Arguflow
      </A>
      <div class="flex items-center space-x-4">
        {globalStore.connectedUser?.()?.publicKey ? (
          <NostrUserPreview />
        ) : (
          <ConnectIdButton />
        )}
        <ConnectedIndicator />
      </div>
    </div>
  );
};

export default Navbar;
