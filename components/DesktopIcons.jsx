"use client"

import { useEffect, useRef, useState } from "react"
import useDesktopStore from "@/app/store/useDesktopStore"
import DesktopIcon from "./DesktopIcon"

const CELL_WIDTH = 100
const CELL_HEIGHT = 90

const DesktopIcons = () => {
    const desktopItems = useDesktopStore(
        (state) => state.desktopItems
    )

    const desktopRef = useRef(null)

    const [grid, setGrid] = useState({ rows: 0, cols: 0})


    useEffect(() => {
        const desktop = desktopRef.current
        if(!desktop) return

        const observer = new ResizeObserver(() => {
            const { width, height } = entry.contentRect

            setGrid({
                rows: Math.floor(height / CELL_HEIGHT),
                cols: Math.floor(width / CELL_WIDTH)
            })
        })

        observer.observe(desktop)


        return () => observer.disconnect()
    }, [])
  return (
    <div ref={desktopRef} className="absolute inset-0">
        {desktopItems.map((item, index) => (
            <div key={item.id}
              className="absolute"
              style={{
                left: item.col * CELL_WIDTH,
                top: item.row * CELL_HEIGHT + 12
              }}
            >
                <DesktopIcon item={item} />
            </div>
        ))}

    </div>
  )
}

export default DesktopIcons