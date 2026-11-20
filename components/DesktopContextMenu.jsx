"use client"

const DesktopContextMenu = ({x, y, onClose}) => {
    return (
        <div
         className="fixed z-50 w-52 rounded-lg border border-background/10 bg-foreground/95 p-1.5 text-background shadow-xl backdrop-blur-xl"
         style={{
            left: x,
            top: y
         }}
         onContextMenu={(e) => e.preventDefault()}
        >
            <button onClick={onClose}>Hello</button>

        </div>
    )
}

export default DesktopContextMenu