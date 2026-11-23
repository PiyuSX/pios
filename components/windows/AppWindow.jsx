import useWindowStore from "@/app/store/useWindowStore"


const AppWindow = ({ window, children }) => {
    const closeWindow = useWindowStore((state) => state.closeWindow)
    const bringFront = useWindowStore((state) => state.bringFront)
  return (
    <div className="absolute bg-amber-200 text-white border"
       onMouseDown={() => bringFront(window.id)}>
        <div>
         <h2>Application</h2>
         <div className="flex items-center gap-3">
            <div className="bg-[#FFBD44]"></div>
            <div className="bg-[#00CA4E]"></div>
            <div onClick={() => closeWindow(window.id)} className="bg-[#FF605C]"></div>
         </div>
        </div>
        <div>
            {children}
        </div>
    </div>
  )
}

export default AppWindow