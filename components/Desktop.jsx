import Image from "next/image";
import TopBar from "./TopBar";
import DesktopIcons from "./DesktopIcons"

const Desktop = ({ setCurrentScreen }) => {
  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden">
        <Image className="absolute" src="/forest.jpg" alt="Forest" fill priority />
        <div className="absolute">
            <TopBar setCurrentScreen={setCurrentScreen} />
            <DesktopIcons />
        </div>
    </div>
  )
}

export default Desktop

