import Image from "next/image";
import TopBar from "./TopBar";
import DesktopIcons from "./DesktopIcons"
import { useState, useEffect } from "react"
import DesktopContextMenu from "./DesktopContextMenu";

const Desktop = ({ setCurrentScreen }) => {
  const [contextMenu, setContextMenu] = useState(null)

  const handleContextMenu = (e) => {
    e.preventDefault()

    setContextMenu({
      x: e.clientX,
      y: e.clientY
    })
  }


  useEffect(() => {
    const closeMenu = () => setContextMenu(null)

    window.addEventListener("click", closeMenu)
    window.addEventListener("resize", closeMenu)
  },[])

  
  return (
    <div 
      className="relative w-full h-dvh overflow-hidden flex flex-col"
      onContextMenu={handleContextMenu}
      >
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

        {contextMenu && (
          <DesktopContextMenu
           x={contextMenu.x}
           y={contextMenu.y}
           onClose={() => setContextMenu(null)}
          />
        )}
    </div>
  )
}

export default Desktop



