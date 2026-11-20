import Image from "next/image";
import TopBar from "./TopBar";
import DesktopIcons from "./DesktopIcons"
import { useState, useEffect } from "react"
import DesktopContextMenu from "./DesktopContextMenu";
import useDesktopStore from "@/app/store/useDesktopStore";

const Desktop = ({ setCurrentScreen }) => {
  const [contextMenu, setContextMenu] = useState(null)

  const setIconSize = useDesktopStore((state) => state.setIconSize)

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


  const handleMenuAction = (action) => {
    switch (action) {
      case "large-icons":
        setIconSize({ width: 56, height: 56 })
        break
      case "small-icons":
        setIconSize({ width: 36, height: 36 })
        break
      case "medium-icons":
        setIconSize({ width: 46, height: 46 })
        break
      case "auto-arrange":
        break
      default:
        break
    }
  }

  
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
           onAction={handleMenuAction}
          />
        )}
    </div>
  )
}

export default Desktop



