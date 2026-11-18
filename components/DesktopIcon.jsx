import Image from "next/image"

const DesktopIcon = ({ icon, name, size }) => {
  return (
    <div>
        <Image src={icon} alt={name} width={size} height={size} />
    </div>
  )
}

export default DesktopIcon
