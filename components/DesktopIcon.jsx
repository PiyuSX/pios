import Image from "next/image"

const DesktopIcon = ({ item }) => {
  return (
    <div className="flex w-22.5 flex-col items-center gap-2 cursor-pointer select-none ">
        <Image src={item.icon} alt={item.name} width={46} height={46} draggable={false} />
        <span className="text-sm text-white text-center wrap-break-word">
          {item.filename}
        </span>
    </div>
  )
}

export default DesktopIcon
