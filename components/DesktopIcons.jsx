import Image from "next/image"


const DesktopIcons = () => {
  return (
    <div>
        <Image src="/folder.svg" alt="Files" width={46} height={46} />
        <Image src="/document.svg" alt="Text" width={46} height={46} />
    </div>
  )
}

export default DesktopIcons