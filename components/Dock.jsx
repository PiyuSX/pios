
"use client"

import useWindowStore from "@/app/store/useWindowStore"
import Image from "next/image"

const pinnedApps = [
    { id: "files", name: "Files", icon: "/folder.svg" },
    { id: "files-2", name: "Files", icon: "/folder.svg" },
    { id: "files-3", name: "Files", icon: "/folder.svg" },
    { id: "files-4", name: "Files", icon: "/folder.svg" },
    { id: "files-5", name: "Files", icon: "/folder.svg" }
]

const Dock = () => {
    const windows = useWindowStore((state) => state.windows)
    const restoreWindow = useWindowStore((state) => state.restoreWindow)
    const bringFront = useWindowStore((state) => state.bringFront)

    return (
        <div className="flex items-center gap-2 rounded-lg bg-background/10 backdrop-blur-[2px] w-min px-2 mx-auto">

            
            {pinnedApps.map((item) => (
                <button
                    key={item.id}
                    title={item.name}
                    className="relative h-12 w-12 shrink-0 rounded-xl hover:scale-110 transition-transform"
                >
                    <Image
                        alt={item.name}
                        src={item.icon}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                    />
                </button>
            ))}

            {windows.length > 0 && (
                <>
                    <div className="h-8 w-px bg-white/30" />

                    {windows.map((window) => (
                        <button
                            key={window.id}
                            title={window.app}
                            onClick={() => {
                                if (window.minimized) {
                                    restoreWindow(window.id)
                                } else {
                                    bringFront(window.id)
                                }
                            }}
                            className="relative h-12 w-12 shrink-0 rounded-xl hover:scale-110 transition-transform"
                        >
                            <Image
                                src="/file.svg"
                                alt={window.app}
                                fill
                                sizes="48px"
                                className="object-contain p-1"
                            />

                            <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full" />
                        </button>
                    ))}
                </>
            )}
        </div>
    )
}

export default Dock
