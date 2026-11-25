import useWindowStore from "@/app/store/useWindowStore"



const AppWindow = ({ window, children, onCloseRequest }) => {
    const closeWindow = useWindowStore((state) => state.closeWindow)
    const bringFront = useWindowStore((state) => state.bringFront)
    const minimizeWindow = useWindowStore((state) => state.minimizeWindow)
  return (
    <div className="z-50 absolute top-20 left-20 w-150 h-100 bg-background text-foreground border border-gray-300 rounded-lg overflow-hidden shadow-xl"
       onMouseDown={() => bringFront(window.id)}>
        <div className="group relative h-10 flex items-center justify-between px-4 bg-gray-100 ">
         <h2 className="text-sm font-medium">SigmaEditor</h2>

         <div className="pointer-events-none absolute text-[11px] font-medium text-muted opacity-0 group-has-[button:hover]:opacity-100 transition-opacity left-1/2 -translate-x-1/2">
           <span className="hidden group-has-[.btn-minimize:hover]:inline">Minimize Window</span>
           <span className="hidden group-has-[.btn-zoom:hover]:inline">Full Screen</span>
           <span className="hidden group-has-[.btn-close:hover]:inline">Close Window</span>
         </div>
         <div className="flex items-center gap-2">
          
            <button
            onClick={() => minimizeWindow(window.id)}
            className="bg-[#FFBD44] w-3 h-3 rounded-full btn-minimize" />
            <button className="bg-[#00CA4E] w-3 h-3 rounded-full btn-zoom" />
   
            <button onClick={() =>{
              const shouldClose = onCloseRequest?.()
              if (shouldClose === false) return
              closeWindow(window.id)
              }} className="bg-[#FF605C] h-3 w-3 rounded-full btn-close" />
         </div>
        </div>
        <div className="h-[calc(100%-40px)] flex flex-col min-h-0">
            {children}
        </div>
    </div>
  )
}

export default AppWindow


