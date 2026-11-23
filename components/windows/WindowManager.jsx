import useWindowStore from "@/app/store/useWindowStore";
import AppWindow from "./AppWindow";

//ALl apps
import TextEditor from "../apps/texteditor/TextEditor";

const apps = {
  "text-editor": TextEditor,
};

const WindowManager = () => {
  const windows = useWindowStore((state) => state.windows);

  console.log("Windows:", windows);
  return (
  <div>
    {windows.map((window) => {
      const App = apps[window.app]

      if (!App) return null

      return (
        <div
          key={window.id}
          className="fixed top-20 left-20 z-[99999] w-[500px] h-[350px] bg-white text-black border-2 border-red-500 p-5"
        >
          <h1>TEXT EDITOR WINDOW</h1>
          <App {...window.props} />
        </div>
      )
    })}
  </div>
)
};

export default WindowManager;
