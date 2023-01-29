import { JSX } from "solid-js";
import Navbar from "../Navbar/Navbar";

export interface ApplicationLayoutProps {
  children: JSX.Element | JSX.Element[] | string;
}

const ApplicationLayout = (props: ApplicationLayoutProps) => {
  return (
    <div class="w-screen h-screen bg-black">
      <Navbar />
      {props.children}
    </div>
  );
};

export default ApplicationLayout;
