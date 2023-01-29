import { JSX, useContext } from "solid-js";
import Navbar from "../Navbar/Navbar";
import { GlobalContext } from "~/contexts/GlobalContext";

export interface ApplicationLayoutProps {
  children: JSX.Element | JSX.Element[] | string;
}

const ApplicationLayout = (props: ApplicationLayoutProps) => {
  const globalContext = useContext(GlobalContext);

  const userPublicKey =
    globalContext.connectedUser && globalContext.connectedUser()?.publicKey;

  return (
    <div class="w-screen h-screen bg-black">
      <Navbar />
      {userPublicKey ? (
        props.children
      ) : (
        <div class="text-white flex w-full justify-center mt-6 px-4">
          <div class="max-w-[75%] w-fit text-center">
            Please connect your Nostr ID to use the app
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationLayout;
