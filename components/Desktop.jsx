import Image from "next/image";
import TopBar from "./TopBar";
import DesktopIcons from "./DesktopIcons"

const Desktop = ({ setCurrentScreen }) => {
  return (
    <div className="relative w-full h-dvh overflow-hidden flex flex-col">
        <Image className="object-cover" src="/forest.jpg" alt="Forest" fill priority />

        <div className="relative z-10 flex flex-col flex-1 min-h-0">
          <div className="shrink-0">
            <TopBar setCurrentScreen={setCurrentScreen} />
          </div>
            <div className="relative flex-1 min-h-0 overflow-hidden">
            <DesktopIcons />
            </div>
            {/* Dock i will add it later */}
        </div>
    </div>
  )
}

export default Desktop



