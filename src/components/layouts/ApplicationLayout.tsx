import { JSX, useContext } from "solid-js";
import Navbar from "../Navbar/Navbar";
import { GlobalContext } from "~/contexts/GlobalContext";

export interface ApplicationLayoutProps {
  children: JSX.Element | JSX.Element[] | string;
}

const ApplicationLayout = (props: ApplicationLayoutProps) => {
  const globalContext = useContext(GlobalContext);

  return (
    <div class="min-h-screen w-screen bg-black overflow-x-hidden">
      <Navbar />
      {globalContext.connectedUser?.()?.publicKey ? (
        props.children
      ) : (
        <div class="mt-6 flex w-full justify-center px-4 text-white">
          <div class="w-fit max-w-[75%] text-center">
            Please connect your Nostr ID to use the app
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationLayout;
