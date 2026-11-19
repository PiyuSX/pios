import Image from "next/image"

const DesktopIcon = ({ item, selected, onSelect }) => {
  return (
    <div
    className={`flex w-22.5 flex-col items-center gap-2 cursor-pointer select-none rounded-xl p-1 
      ${selected ? "bg-white/20 ring-1 ring-white/30" : "hover:bg-white/10"}
    `}>
        <Image src={item.icon} alt="desktop icon" width={46} height={46} draggable={false} />
        <span className="text-sm text-white text-center wrap-break-word">
          {item.filename} 
        </span>
    </div>
  )
}

export default DesktopIcon

