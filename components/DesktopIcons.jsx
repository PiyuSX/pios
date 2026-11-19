"use client";

import { useEffect, useRef, useState } from "react";
import useDesktopStore from "@/app/store/useDesktopStore";
import DesktopIcon from "./DesktopIcon";

const MIN_CELL_WIDTH = 100;
const MIN_CELL_HEIGHT = 90;

const DesktopIcons = () => {
  const desktopItems = useDesktopStore((state) => state.desktopItems);

  const moveItem = useDesktopStore((state) => state.moveItem)

  const [drag, setDrag] = useState(null)

  const dragStart = useRef(null)

  const supressClick = useRef(false)

//   const validatePosition = useDesktopStore((state) => state.validatePosition);

  const desktopRef = useRef(null);

  const [grid, setGrid] = useState({
    rows: 0,
    cols: 0,
    cellWidth: 0,
    cellHeight: 0,
  });

  const [selectedId, setSelectedId] = useState([])

  const displayItems  = (() => {
    if (!grid.rows || !grid.cols) return []

    const occupied = new Set()
    const positions = []

    desktopItems.forEach((item) => {
        if (
            item.row >= 0 &&
            item.row < grid.rows &&
            item.col >= 0 &&
            item.col < grid.cols
        ) {
            const key = `${item.row}-${item.col}`

            if (!occupied.has(key)) {
                occupied.add(key)
                positions.push({
                    ...item,
                    displayRow: item.row,
                    displayCol: item.col
                })
                return
            }
        }

        positions.push({...item, displayRow: -1, displayCol: -1})
    })

    //relocate that dont fit 

    positions.forEach((item) => {
        if (item.displayRow !== -1) return

        for (let col = 0; col < grid.cols; col++) {
            for (let row = 0; row < grid.rows; row++) {
                const key = `${row}-${col}`;

                if (!occupied.has(key)) {
                    occupied.add(key)
                    item.displayRow = row
                    item.displayCol = col
                    return
                }
            }
        }
    })

    return positions
  }) ()

  useEffect(() => {
    const desktop = desktopRef.current;
    if (!desktop) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;

      const cols = Math.max(1, Math.floor(width / MIN_CELL_WIDTH));
      const rows = Math.max(1, Math.floor(height / MIN_CELL_HEIGHT));

      setGrid({
        rows,
        cols,
        cellWidth: width / cols,
        cellHeight: height / rows,
      });

      console.log("Workspace:", width, height);
      console.log("Columns:", cols);
      console.log("Rows:", rows);
      console.log("Total cells:", rows * cols);
    });

    observer.observe(desktop);

    return () => observer.disconnect();
  }, []);


  const handleSelect = (id, multiSelect) => {
    if (supressClick.current) {
      supressClick.current = false
      return
    }
    if (multiSelect) {
      setSelectedId((prev) => prev.includes(id) ? 
      prev.filter((itemId) => itemId !== id) : [...prev, id])
    } else {
      setSelectedId([id])
    }
  }


  const handleDragStart = (e, item) => {
    if (e.button !== 0) return

    supressClick.current = false

    const rect = e.currentTarget.getBoundingClientRect()
    const desktopRect = desktopRef.current.getBoundingClientRect()

    const start = {
      id: item.id,
      pointerId: e.pointerId,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientX - rect.top,
      left: rect.left - desktopRect.left,
      top: rect.top - desktopRect.top,
      startX: e.clientX,
      startY: e.clientY,
      moved: false
    }

    dragStart.current = start

    e.currentTarget.setPointerCapture(e.pointerId)
  }


  const handleDragMove = (e) => {
    const start = dragStart.current
    if (!start || start.pointerId !== e.pointerId) return

    const distance = Math.hypot(
      e.clientX - start.startX,
      e.clientY - start.startY
    )

    // Ignoring small movement

    if (distance < 5 && !start.moved) return

    start.moved = true
    const desktopRect = desktopRef.current.getBoundingClientRect()

    start.left = e.clientX - desktopRect.left - start.offsetX
    start.top = e.clientY - desktopRect.top - start.offsetY

    setDrag({
      id: start.id,
      left: start.left,
      top: start.top
    })
  }
  

  const handleDragEnd = (e) => {
    const start = dragStart.current

    if (!start || start.pointerId !== e.pointerId) return

    if (start.moved) {
      const col = Math.max(
        0, Math.min(grid.cols - 1, Math.round(start.left / grid.cellWidth))

      )

      const row = Math.max(
        0, Math.min(grid.rows - 1, Math.round(start.top / grid.cellHeight))
      )

      const occupied = displayItems.some(
        (item) => 
          item.id !== start.id &&
          item.displayCol === col &&
          item.displayRow === row
      )

      if (!occupied) {
        moveItem(start.id, row, col)
      }

      supressClick.current = true
    }

    dragStart.current = null
    setDrag(null)
  }

//   useEffect(() => {
//     if (!grid.rows || !grid.cols) return;

//     validatePosition(grid.rows, grid.cols);
//   }, [grid.rows, grid.cols, validatePosition]);

  return (
    <div ref={desktopRef} className="absolute inset-0"
      onClick={() => setSelectedId([])}
    >
      {displayItems.map((item) => (
        <div
          key={item.id}
          className="absolute flex items-center justify-center"
          onPointerDown={(e) => handleDragStart(e, item)}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
          style={{
            left: drag?.id === item.id ? drag.left : item.displayCol * grid.cellWidth,

            top: drag?.id === item.id ? drag.top : item.displayRow * grid.cellHeight,

            width: grid.cellWidth,
            height: grid.cellHeight,
            zIndex: drag?.id === item.id ? 10 : 0,
            touchAction: "none"
          }}
        >
          <DesktopIcon item={item} selected={selectedId.includes(item.id)} onSelect={handleSelect} />
        </div>
      ))}
    </div>
  );
};

export default DesktopIcons;



