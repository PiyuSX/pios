import useWindowStore from "@/app/store/useWindowStore"



const AppWindow = ({ window, children }) => {
    const closeWindow = useWindowStore((state) => state.closeWindow)
    const bringFront = useWindowStore((state) => state.bringFront)
  return (
    <div className="absolute top-20 left-20 w-[600px] h-[400px] bg-background text-foreground border border-gray-300 rounded-lg overflow-hidden shadow-xl"
       onMouseDown={() => bringFront(window.id)}>
        <div className="h-10 flex items-center justify-between px-4 bg-gray-100 border-b">
         <h2 className="text-sm font-medium">Application</h2>
         <div className="flex items-center gap-2">
            <button className="bg-[#FFBD44] w-3 h-3 rounded-full" />
            <button className="bg-[#00CA4E] w-3 h-3 rounded-full" />
            <button onClick={() => closeWindow(window.id)} className="bg-[#FF605C] h-3 w-3 rounded-full" />
         </div>
        </div>
        <div className="h-[calc(100%-40px)]">
            {children}
        </div>
    </div>
  )
}

export default AppWindow



