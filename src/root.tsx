// @refresh reload
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import "./root.css";
import RelayStoreContext from "./contexts/GlobalContext";
import theme from "./contexts/GlobalContext";
import { createEffect, onCleanup } from "solid-js";

export default function Root() {
  let setDark = "";
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  )
    setDark = "dark";

  createEffect(() => {
    const script = document.createElement("script");
    script.src = "https://perhaps.arguflow.com/js/script.js";
    script.defer = true;
    script["data-domain"] = "app.arguflow.gg";
    document.body.appendChild(script);

    onCleanup(() => document.body.removeChild(script));
  });

  return (
    <Html lang="en" class={setDark}>
      <Head>
        <Title>arguflow app</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body class="bg-white overflow-x-hidden scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700">
        <ErrorBoundary>
          <RelayStoreContext>
            <Routes>
              <FileRoutes />
            </Routes>
          </RelayStoreContext>
        </ErrorBoundary>
        <Scripts />
      </Body>
    </Html>
  );
}
