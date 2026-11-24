import useWindowStore from "@/app/store/useWindowStore";
import AppWindow from "./AppWindow";
import { useEffect, useState } from "react";

//ALl apps
import TextEditor from "../apps/texteditor/TextEditor";

const apps = {
  "text-editor": TextEditor,
};

const WindowManager = () => {
  const windows = useWindowStore((state) => state.windows);

  const [closeHandlers, setCloseHandlers] = useState({})

  useEffect(() => {
    console.log("Windows changed", windows)
  }, [windows])

  return (
  <>
    {windows.map((window) => {
      const App = apps[window.app]

      if (!App) return null

      return (
      <AppWindow key={window.id} window={window} onCloseRequest={closeHandlers[window.id]}>
        <App 
         {...window.props}
         onRegisterClose={(handler) => 
          setCloseHandlers((prev) => ({
            ...prev,
            [window.id]: handler
          }))
         }
         />
      </AppWindow>
      )
    })}
  </>
)
};

export default WindowManager;
