import { useContext } from "solid-js";
import ConnectedIndicator from "../ConnectedIndicator";
import ConnectIdButton from "./ConnectIdButton";
import { GlobalContext } from "~/contexts/GlobalContext";
import NostrUserPreview from "./NostrUserPreview";
import { effect } from "solid-js/web";

const Navbar = () => {
  const globalStore = useContext(GlobalContext);

  return (
    <div class="w-full bg-transparent border-b border-gray-800 flex justify-between items-center px-16 py-8">
      <div class="text-white text-2xl">Arguflow</div>
      <div class="flex items-center space-x-4">
        {globalStore.connectedUser ? <NostrUserPreview /> : <ConnectIdButton />}
        <ConnectedIndicator />
      </div>
    </div>
  );
};

export default Navbar;
