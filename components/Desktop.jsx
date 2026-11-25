import Image from "next/image";
import TopBar from "./TopBar";
import DesktopIcons from "./DesktopIcons"
import { useState, useEffect } from "react"
import DesktopContextMenu from "./DesktopContextMenu";
import useDesktopStore from "@/app/store/useDesktopStore";
import { notify } from "@/app/store/useNotificationStore";
import WindowManager from "./windows/WindowManager";
import Dock from "./Dock";

const Desktop = ({ setCurrentScreen }) => {

  const [selectedId, setSelectedId] = useState([])

  const [contextMenu, setContextMenu] = useState(null)

  const setIconSize = useDesktopStore((state) => state.setIconSize)

  const autoArrangeIcons = useDesktopStore((state) => state.autoArrange)

  const [gridSize, setGridSize] = useState({ rows: 0, cols: 0})

  const [gridInfo, setGridInfo] = useState(null)

  const addItem = useDesktopStore((state) => state.addItem)

  const renameItem = useDesktopStore((state) => state.renameItem)

  const [renamingId, setRenamingId] = useState(null)

  const removeItem = useDesktopStore((state) => state.removeItem)




  

  const handleContextMenu = (e) => {
    e.preventDefault()

    setContextMenu({
      x: e.clientX,
      y: e.clientY
    })
  }

  const handleRename = (id, newName) => {
    renameItem(id, newName)
    setRenamingId(null)
  }

  const cancelRename = () => {
    setRenamingId(null)
  }




  useEffect(() => {
    const closeMenu = () => setContextMenu(null)

    window.addEventListener("click", closeMenu)
    window.addEventListener("resize", closeMenu)
  },[])


  const getPreferredPosition = () => {
    if (!gridInfo || !contextMenu) return null
    
    const desktop = document.querySelector("[data-desktop-grid]")
    if (!desktop) return null

    const rect = desktop.getBoundingClientRect()

    const col = Math.floor(
      (contextMenu.x - rect.left) / gridInfo.cellWidth
    )

    const row = Math.floor(
      (contextMenu.y - rect.top) / gridInfo.cellHeight
    )

    return {
      row: Math.max(0, Math.min(row, gridInfo.rows - 1)),
      col: Math.max(0, Math.min(col, gridInfo.cols - 1))
    }
  }


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
        autoArrangeIcons(gridSize.rows, gridSize.cols)
        break
      case "new-folder": {
      
        const position = getPreferredPosition()

        if (!position || !gridInfo) break

        addItem(
          "New Folder",
          "folder",
          gridInfo.rows,
          gridInfo.cols,
          position.row,
          position.col
        )

        break
      }

      case "new-file": {
        const position = getPreferredPosition()

        if (!position || !gridInfo) break

        addItem(
          "newfile.txt",
          "file",
          gridInfo.rows,
          gridInfo.cols,
          position.row,
          position.col
        )
        break
      }
      case "rename": {
        if (selectedId.length !== 1) break

        setRenamingId(selectedId[0])
        break
      }

      case "delete": {
        const items = useDesktopStore.getState().desktopItems

        if (selectedId.some(id => items.find(item => item.id === id)?.isSystem)) {
          notify("System", "Twin You can't delete my Stuff! 😼", "3000")
        }
        

        selectedId.forEach((id) => removeItem(id))
        setSelectedId([])

        break
      }

      case "open": {
        break
      }
      default:
        break
    }
  }

  
  return (
    <div 
      data-desktop-grid
      className="relative w-full h-dvh overflow-hidden flex flex-col"
      onContextMenu={handleContextMenu}
      >
        <Image className="object-cover" src="/forest.jpg" alt="Forest" fill priority />

        <div className="relative z-10 flex flex-col flex-1 min-h-0">
          <div className="shrink-0">
            <TopBar setCurrentScreen={setCurrentScreen} />
          </div>
            <div className="relative flex-1 min-h-0 overflow-hidden">
            <DesktopIcons
              setGridSize={setGridSize}
              setGridInfo={setGridInfo}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              renamingId={renamingId}
              onRename={handleRename}
              onCancelRename={cancelRename}
            />
            </div>
            <div className="absolute bottom-3 left-0 right-0 z-10 pointer-events-none">
            <Dock />
            </div>
        </div>

        {contextMenu && (
          <DesktopContextMenu
           selectedId={selectedId}
           x={contextMenu.x}
           y={contextMenu.y}
           onClose={() => setContextMenu(null)}
           onAction={handleMenuAction}
          />
        )}
        
        <WindowManager />
    </div>
  )
}

export default Desktop



