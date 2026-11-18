import Image from "next/image";
import TopBar from "./TopBar";
import DesktopIcons from "./DesktopIcons"

const Desktop = ({ setCurrentScreen }) => {
  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden flex flex-col">
        <Image className="absolute" src="/forest.jpg" alt="Forest" fill priority />

        <div className="relative z-10 flex flex-col flex-1 min-h-0">
            <TopBar setCurrentScreen={setCurrentScreen} />
            <div className="relative flex-1 min-h-0 overflow-hidden">
            <DesktopIcons />
            </div>
        </div>
    </div>
  )
}

export default Desktop

