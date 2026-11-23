import {create} from "zustand"

const useWindowStore = create((set) => ({
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


    closeWindow: (id) => set((state) => ({
        windows: state.windows.filter((window) => window.id !== id),
        focusedWindowId: null
    })),


    bringFront: (id) => set({
        focusedWindowId: id
    })
})
    
)


export default useWindowStore