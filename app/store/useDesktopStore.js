import { create } from "zustand"
import { persist } from "zustand/middleware"

const defaultItems = [
    {
        id: "system-files",
        filename: "Files",
        icon: "/folder.svg",
        type: "folder",
        isSystem: true,
        row: 0,
        col: 0
    },
    {
        id: "system-text",
        filename: "Text",
        icon: "/document.svg",
        type: "file",
        isSystem: true,
        row: 1,
        col: 0
    },
    {
        id: "test-folder",
        filename: "Projects",
        icon: "/folder.svg",
        type: "folder",
        isSystem: false,
        row: 2,
        col: 0
    },
    {
        id: "test-file-1",
        filename: "README",
        icon: "/document.svg",
        type: "file",
        isSystem: false,
        row: 3,
        col: 0
    },
    {
        id: "test-file-2",
        filename: "Portfolio",
        icon: "/document.svg",
        type: "file",
        isSystem: false,
        row: 0,
        col: 1
    },
    {
        id: "test-folder-2",
        filename: "Images",
        icon: "/folder.svg",
        type: "folder",
        isSystem: false,
        row: 1,
        col: 1
    },
    {
        id: "test-file-3",
        filename: "Right Edge",
        icon: "/document.svg",
        type: "file",
        isSystem: false,
        row: 0,
        col: 18
    },
    {
        id: "test-folder-3",
        filename: "Bottom Edge",
        icon: "/folder.svg",
        type: "folder",
        isSystem: false,
        row: 9,
        col: 0
    },
    {
        id: "test-folder-4",
        filename: "Bottom Right",
        icon: "/folder.svg",
        type: "folder",
        isSystem: false,
        row: 9,
        col: 18
    }
]

const useDesktopStore = create(
    persist(
        (set, get) => ({
            desktopItems: defaultItems,

            //To add new file or folder
            addItem: (filename, type, rows, cols) => {
                const items = get().desktopItems

                let row = 0
                let col = 0
                let found = false

                //Finding the next avilavle grid position

                for (let c = 0; c < cols && ! found; c++) {
                    for (let r = 0; r < rows ; r++) {
                        const occupied = items.some(
                            (item) => item.row === r && item.col === c
                        )

                        if (!occupied) {
                            row = r
                            col = c
                            found = true
                            break
                        }
                    }
                }

                if (!found) return //No avilable position

                const newItem = {
                    id: crypto.randomUUID(),
                    filename,
                    icon: type === "folder" ? "/folder,svg" : `/${type}.svg`,
                    type,
                    isSystem: false,
                    row,
                    col
                }

                set((state) => ({
                    desktopItems: [...state.desktopItems, newItem]
                }))

            },


            //Remove but only non system items
            removeItem: (id) => set((state) => ({
                desktopItems: state.desktopItems.filter((item) => item.id !== id || item.isSystem)
            })),

            //Rename | only user created files 
            renameItem: (id, filename) => set((state) => ({
                desktopItems: state.desktopItems.map((item) => 
                 item.id === id && !item.isSystem ? { ...item, filename} : item
                )
            })),

            moveItem: (id, row, col) => {
                const items = get().desktopItems

                if (row < 0 || col < 0) return

                const targetOccupied = items.some(
                    (item) => item.row === row && item.col === col && item.id != id
                )
                if (targetOccupied) return

                set((state) => ({
                    desktopItems: state.desktopItems.map((item) => 
                     item.id === id ? {...item, row, col } : item)
                }))


            },

            validatePosition: (rows, cols) => {
                const items = get().desktopItems

                const occupied = new Set()

                const updatedItems = items.map((item) => {
                    const key = `${item.row}-${item.col}`

                    if (
                        item.row >= 0 &&
                        item.row < rows &&
                        item.col >= 0 &&
                        item.col < cols &&
                        !occupied.has(key)

                    ) {
                        occupied.add(key)

                        return item
                    }

                    //Finding next avi position

                    let found = false

                    for (let c = 0; c < cols && !found; c++) {
                        for (let r = 0; r < rows; r++) {
                            const newKey = `${r}-${c}`

                            if (!occupied.has(newKey)) {
                                occupied.add(newKey)

                                found = true

                                return { ...item, row: r, col: c}
                            }


                        }
                    }
                    // Incase of no avi postion

                    return item
                }
                
            )

            set({ desktopItems: updatedItems })
        
        },

            //Restore default icons
            resetDesktop: () => set({ desktopItems: defaultItems })

           
        }),
        {
            name: "pios-desktop",
            version: 1
        }


    )
)



export default useDesktopStore


