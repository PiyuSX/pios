"use client";

import { useEffect, useRef, useState } from "react";
import useDesktopStore from "@/app/store/useDesktopStore";
import DesktopIcon from "./DesktopIcon";

const MIN_CELL_WIDTH = 100;
const MIN_CELL_HEIGHT = 90;

const DesktopIcons = () => {
  const desktopItems = useDesktopStore((state) => state.desktopItems);

  const validatePosition = useDesktopStore((state) => state.validatePosition);

  const desktopRef = useRef(null);

  const [grid, setGrid] = useState({
    rows: 0,
    cols: 0,
    cellWidth: 0,
    cellHeight: 0,
  });

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

  useEffect(() => {
    if (!grid.rows || !grid.cols) return;

    validatePosition(grid.rows, grid.cols);
  }, [grid.rows, grid.cols, validatePosition]);

  return (
    <div ref={desktopRef} className="absolute inset-0">
      {desktopItems.map((item) => (
        <div
          key={item.id}
          className="absolute flex items-center justify-center"
          style={{
            left: item.col * grid.cellWidth,
            top: item.row * grid.cellHeight,
            width: grid.cellWidth,
            height: grid.cellHeight,
          }}
        >
          <DesktopIcon item={item} />
        </div>
      ))}
    </div>
  );
};

export default DesktopIcons;
