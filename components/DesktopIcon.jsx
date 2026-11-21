import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const DesktopIcon = ({
  item,
  selected,
  size,
  renaming,
  onRename,
  onCancelRename,
}) => {
  const [name, setName] = useState(item.filename);
  const inputRef = useRef(null);
  const cancell = useRef(false);

  useEffect(() => {
    if (renaming) {
      setName(item.filename);
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [renaming, item.filename]);

  const handleKeyDown = (e) => {
    e.stopPropagation();

    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }

    if (e.key === "Escape") {
      e.preventDefault();
      cancell.current = true;
      setName(item.filename);
      onCancelRename();
    }
  };

  const handleBlur = () => {
    if (cancell.current) {
      cancell.current = false;
      return;
    }

    const newName = name.trim();

    if (!newName) {
      onCancelRename();
      return;
    }

    onRename(item.id, newName);
  };

  return (
    <div
      className={`flex w-22.5 flex-col items-center gap-2 cursor-pointer select-none rounded-xl p-1 
      ${selected ? "bg-white/20 ring-1 ring-white/30" : "hover:bg-white/10"}
    `}
    >
      <Image
        src={item.icon}
        alt="desktop icon"
        width={size.width}
        height={size.height}
        draggable={false}
      />
      {renaming ? (
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="w-full rounded-sm px-1 text-sm text-background  text-center outline-none"
        />
      ) : (
        <span className="text-sm text-background text-center wrap-break-word">
          {item.filename}
        </span>
      )}
    </div>
  );
};

export default DesktopIcon;
