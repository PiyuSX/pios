"use client";

import { useEffect, useRef, useState } from "react";
import useDesktopStore from "@/app/store/useDesktopStore";
import DesktopIcon from "./DesktopIcon";
import useWindowStore from "@/app/store/useWindowStore"



const DesktopIcons = ({ 
  setGridSize,
  setGridInfo,
  selectedId,
  setSelectedId,
  renamingId,
  onRename,
  onCancelRename

}) => {
  const iconSize = useDesktopStore((state) => state.iconSize)

  const desktopItems = useDesktopStore((state) => state.desktopItems)

  const moveItems = useDesktopStore((state) => state.moveItems)

  const [drag, setDrag] = useState(null)

  const dragStart = useRef(null)

  const supressClick = useRef(false)

  const openFile = useWindowStore((state) => state.openFile)

  //   const validatePosition = useDesktopStore((state) => state.validatePosition);

  const desktopRef = useRef(null)

  const [grid, setGrid] = useState({
    rows: 0,
    cols: 0,
    cellWidth: 0,
    cellHeight: 0,
  });


  const displayItems = (() => {
    if (!grid.rows || !grid.cols) return [];

    const occupied = new Set();
    const positions = [];

    desktopItems.forEach((item) => {
      if (
        item.row >= 0 &&
        item.row < grid.rows &&
        item.col >= 0 &&
        item.col < grid.cols
      ) {
        const key = `${item.row}-${item.col}`;

        if (!occupied.has(key)) {
          occupied.add(key);
          positions.push({
            ...item,
            displayRow: item.row,
            displayCol: item.col,
          });
          return;
        }
      }

      positions.push({ ...item, displayRow: -1, displayCol: -1 });
    });

    //relocate that dont fit

    positions.forEach((item) => {
      if (item.displayRow !== -1) return;

      for (let col = 0; col < grid.cols; col++) {
        for (let row = 0; row < grid.rows; row++) {
          const key = `${row}-${col}`;

          if (!occupied.has(key)) {
            occupied.add(key);
            item.displayRow = row;
            item.displayCol = col;
            return;
          }
        }
      }
    });

    return positions;
  })();

  useEffect(() => {
    const desktop = desktopRef.current
    if (!desktop) return

    const minCellWidth = Math.max(100, iconSize.width + 54)
    const minCellHeight = Math.max(90, iconSize.height + 44)

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;


      const cols = Math.max(1, Math.floor(width / minCellWidth));
      const rows = Math.max(1, Math.floor(height / minCellHeight));

      setGrid({
        rows,
        cols,
        cellWidth: width / cols,
        cellHeight: height / rows,
      });

      setGridSize({ rows, cols })
      setGridInfo({
        rows,
        cols,
        cellWidth: width / cols,
        cellHeight: height / rows,
        rect: desktop.getBoundingClientRect()
      })
    });

    observer.observe(desktop);

    return () => observer.disconnect();
  }, [iconSize.width, iconSize.height]);

  const handleSelect = (id, multiSelect) => {
    if (supressClick.current) {
      supressClick.current = false;
      return;
    }
    if (multiSelect) {
      setSelectedId((prev) =>
        prev.includes(id)
          ? prev.filter((itemId) => itemId !== id)
          : [...prev, id],
      );
    } else {
      setSelectedId([id]);
    }
  };

  const handleDragStart = (e, item) => {
    if (e.button !== 0) return;

    supressClick.current = false;

    const rect = e.currentTarget.getBoundingClientRect();
    const desktopRect = desktopRef.current.getBoundingClientRect();

    const group = selectedId.includes(item.id)
      ? displayItems.filter((i) => selectedId.includes(i.id))
      : [item];

    const start = {
      id: item.id,
      pointerId: e.pointerId,
      initialLeft: rect.left - desktopRect.left,
      initialTop: rect.top - desktopRect.top,

      startX: e.clientX,
      startY: e.clientY,
      anchorRow: item.displayRow,
      anchorCol: item.displayCol,

      group: group.map((i) => ({
        id: i.id,
        row: i.displayRow,
        col: i.displayCol,
      })),

      wasSelected: selectedId.includes(item.id),
      deltaX: 0,
      deltaY: 0,
      moved: false,
    };

    dragStart.current = start;

    // e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleDragMove = (e) => {
    const start = dragStart.current;
    if (!start || start.pointerId !== e.pointerId) return;

    const deltaX = e.clientX - start.startX;
    const deltaY = e.clientY - start.startY;

    const distance = Math.hypot(deltaX, deltaY);

    // Ignoring small movement

    if (distance < 5 && !start.moved) return;

    //Capture pointer only when actual dragging starts
    if (!start.moved) {
      e.currentTarget.setPointerCapture(e.pointerId)
    }

    if (!start.moved && !start.wasSelected) {
      setSelectedId([start.id]);
    }

    start.moved = true;
    start.deltaX = deltaX;
    start.deltaY = deltaY;

    setDrag({
      id: start.id,
      ids: start.group.map((item) => item.id),
      group: start.group,
      deltaX,
      deltaY,
    });
  };

  const handleDragEnd = (e) => {
    const start = dragStart.current;

    if (!start || start.pointerId !== e.pointerId) return;

    if (start.moved) {
      const minCol = Math.min(...start.group.map((item) => item.col));
      const maxCol = Math.max(...start.group.map((item) => item.col));

      const minRow = Math.min(...start.group.map((item) => item.row));
      const maxRow = Math.max(...start.group.map((item) => item.row));

      const minAllowedCol = start.anchorCol - minCol;
      const maxAllowedCol = grid.cols - 1 - (maxCol - start.anchorCol);

      const minAllowedRow = start.anchorRow - minRow;
      const maxAllowedRow = grid.rows - 1 - (maxRow - start.anchorRow);

      const targetCol = Math.max(
        minAllowedCol,
        Math.min(
          maxAllowedCol,
          start.anchorCol + Math.round(start.deltaX / grid.cellWidth),
        ),
      );

      const targetRow = Math.max(
        minAllowedRow,
        Math.min(
          maxAllowedRow,
          start.anchorRow + Math.round(start.deltaY / grid.cellHeight),
        ),
      );

      const colShift = targetCol - start.anchorCol;
      const rowShift = targetRow - start.anchorRow;

      const moves = start.group.map((item) => ({
        id: item.id,
        row: item.row + rowShift,
        col: item.col + colShift,
      }));

      moveItems(moves, displayItems);

      supressClick.current = true;
    }

    dragStart.current = null;
    setDrag(null);
  };


  const handleOpenFile = (item) => {
    console.log("Handle Open", item)

    if (item.type !== "file") return

    openFile(item)
  }

  //   useEffect(() => {
  //     if (!grid.rows || !grid.cols) return;

  //     validatePosition(grid.rows, grid.cols);
  //   }, [grid.rows, grid.cols, validatePosition]);

  return (
    <div
      ref={desktopRef}
      className="absolute inset-0"
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
            left: drag?.ids.includes(item.id)
              ? drag.group.find((i) => i.id === item.id).col * grid.cellWidth +
                drag.deltaX
              : item.displayCol * grid.cellWidth,

            top: drag?.ids.includes(item.id)
              ? drag.group.find((i) => i.id === item.id).row * grid.cellHeight +
                drag.deltaY
              : item.displayRow * grid.cellHeight,

            width: grid.cellWidth,
            height: grid.cellHeight,
            zIndex: drag?.ids.includes(item.id) ? 10 : 0,
            touchAction: "none",
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleSelect(item.id, e.ctrlKey)
          }}
        >
          <DesktopIcon
            size={iconSize}
            item={item}
            selected={selectedId.includes(item.id)}
            onSelect={handleSelect}
            renaming={renamingId === item.id}
            onRename={onRename}
            onCancelRename={onCancelRename}
            onDoubleClick={() => handleOpenFile(item)}
          />
        </div>
      ))}
    </div>
  );
};

export default DesktopIcons

