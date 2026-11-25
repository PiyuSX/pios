import {create} from "zustand"
import { persist } from "zustand/middleware"

const getWindowPosition = (windows) => {
    const offset = 30
    const base = 80
    const maxPositions = 8

    for (let i = 0; i < maxPositions; i++) {
        const x = base + i * offset
        const y = base + i * offset

        const occupied = windows.some((window) =>
         (window.x ?? base) === x &&
        (window.y ?? base) === y
        )

        if (!occupied) {
            return {x,y}
        }
    }

    return { x: base, y: base }

}


const useWindowStore = create(
    persist(
    (set) => ({
    windows: [],
    focusedWindowId: null,

    openApp: (app, props = {}) => {
        const id = crypto.randomUUID()

        set((state) => {
            const position = getWindowPosition(state.windows)

            const newWindow = {
                id,
                app,
                props,
                ...position,
                minimized: false,
                maximized: false
            }

            return {
                windows: [...state.windows, newWindow],
                focusedWindowId: id
            }
        })
    },


    openFile: (file) => {
        const extension = file.filename.split(".").pop().toLowerCase()

        const appMap = {
            txt: "text-editor",
            md: "code-editor",
            html: "browser",
            js: "code-editor",
            css: "code-editor"
        }

        const app = appMap[extension]

        if (!app) return

        const id = crypto.randomUUID()

        set((state) => {
            const position = getWindowPosition(state.windows)

            const newWindow = {
                id,
                app,
                props: { fileId: file.id },
                ...position,
                minimized: false,
                maximized: false
            }

            return {
                windows: [...state.windows, newWindow],
                focusedWindowId: id
            }
        })
    },


    closeWindow: (id) => set((state) => ({
        windows: state.windows.filter((window) => window.id !== id),
        focusedWindowId: null
    })),



    bringFront: (id) => set({
        focusedWindowId: id
    }),

    moveWindow: (id, x, y) => set((state) => ({
        windows: state.windows.map((window) => 
         window.id === id
        ? { ...window, x, y}
        : window
        )
    })),

    minimizeWindow: (id) => set((state) => ({
        windows: state.windows.map((window) =>
         window.id === id ? {...window, minimized: true } : window
        ),
        focusedWindowId: state.focusedWindowId === id ? null : state.focusedWindowId
    })),

    restoreWindow: (id) => set((state) => ({
        windows: state.windows.map((window) =>
         window.id === id ? {...window, minimized: false} : window
        ),
        focusedWindowId: id
    }))
}),
{
    name: "pios-windows"
}
)
    
)


export default useWindowStore
