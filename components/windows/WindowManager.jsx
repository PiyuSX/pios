import useWindowStore from "@/app/store/useWindowStore";
import AppWindow from "./AppWindow";
import { useEffect } from "react";

//ALl apps
import TextEditor from "../apps/texteditor/TextEditor";

const apps = {
  "text-editor": TextEditor,
};

const WindowManager = () => {
  const windows = useWindowStore((state) => state.windows);

  useEffect(() => {
    console.log("Windows changed", windows)
  }, [windows])

  return (
  <>
    {windows.map((window) => {
      const App = apps[window.app]

      if (!App) return null

      return (
      <AppWindow key={window.id} window={window}>
        <App {...window.props} />
      </AppWindow>
      )
    })}
  </>
)
};

export default WindowManager;
