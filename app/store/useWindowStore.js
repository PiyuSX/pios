import {create} from "zustand"
import { persist } from "zustand/middleware"


const useWindowStore = create(
    persist(
    (set) => ({
    windows: [],
    focusedWindowId: null,

    openApp: (app, props = {}) => {
        const newWindow = {
            id: crypto.randomUUID(),
            app,
            props,
            minimized: false,
            maximized: false
        }

        set((state) => ({
            windows: [...state.windows, newWindow],
            focusedWindowId: newWindow.id
        }))
    },

    openFile: (file) => {
        console.log("Open file Action", file)
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

        const newWindow = {
            id: crypto.randomUUID(),
            app,
            props: { fileId: file.id },
            minimized: false,
            maximized: false
        }

        set((state) => ({
            windows: [...state.windows, newWindow],
            focusedWindowId: newWindow.id
        }))
    },


    closeWindow: (id) => set((state) => ({
        windows: state.windows.filter((window) => window.id !== id),
        focusedWindowId: null
    })),



    bringFront: (id) => set({
        focusedWindowId: id
    })
}),
{
    name: "pios-windows"
}
)
    
)


export default useWindowStore