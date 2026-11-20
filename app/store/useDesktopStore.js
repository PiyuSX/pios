import { create } from "zustand"
import { persist } from "zustand/middleware"

const defaultItems = [
           {
        id: "test-folder-5",
        filename: "Documents",
        icon: "/folder.svg",
        type: "folder",
        isSystem: false,
        row: 4,
        col: 0
    },
    {
        id: "test-file-4",
        filename: "Notes",
        icon: "/document.svg",
        type: "file",
        isSystem: false,
        row: 5,
        col: 0
    },
    {
        id: "test-folder-6",
        filename: "Downloads",
        icon: "/folder.svg",
        type: "folder",
        isSystem: false,
        row: 6,
        col: 0
    },
    {
        id: "test-file-5",
        filename: "Resume",
        icon: "/document.svg",
        type: "file",
        isSystem: false,
        row: 7,
        col: 0
    },
    {
        id: "test-file-6",
        filename: "Budget",
        icon: "/document.svg",
        type: "file",
        isSystem: false,
        row: 8,
        col: 0
    },
    {
        id: "test-folder-7",
        filename: "Music",
        icon: "/folder.svg",
        type: "folder",
        isSystem: false,
        row: 2,
        col: 1
    },
    {
        id: "test-file-7",
        filename: "Todo",
        icon: "/document.svg",
        type: "file",
        isSystem: false,
        row: 3,
        col: 1
    },
    {
        id: "test-folder-8",
        filename: "Videos",
        icon: "/folder.svg",
        type: "folder",
        isSystem: false,
        row: 4,
        col: 1
    },
    {
        id: "test-file-8",
        filename: "Changelog",
        icon: "/document.svg",
        type: "file",
        isSystem: false,
        row: 5,
        col: 1
    },
    {
        id: "test-folder-9",
        filename: "Archive",
        icon: "/folder.svg",
        type: "folder",
        isSystem: false,
        row: 6,
        col: 1
    },
    {
        id: "test-file-9",
        filename: "Invoices",
        icon: "/document.svg",
        type: "file",
        isSystem: false,
        row: 7,
        col: 1
    },
    {
        id: "test-folder-10",
        filename: "Backups",
        icon: "/folder.svg",
        type: "folder",
        isSystem: false,
        row: 8,
        col: 1
    },
    {
        id: "test-file-10",
        filename: "Contracts",
        icon: "/document.svg",
        type: "file",
        isSystem: false,
        row: 9,
        col: 1
    },
    {
        id: "test-folder-11",
        filename: "Photos",
        icon: "/folder.svg",
        type: "folder",
        isSystem: false,
        row: 0,
        col: 2
    },
    {
        id: "test-file-11",
        filename: "Ideas",
        icon: "/document.svg",
        type: "file",
        isSystem: false,
        row: 1,
        col: 2
    },
    {
        id: "test-folder-12",
        filename: "Work",
        icon: "/folder.svg",
        type: "folder",
        isSystem: false,
        row: 2,
        col: 2
    },
    {
        id: "test-file-12",
        filename: "Meeting Notes",
        icon: "/document.svg",
        type: "file",
        isSystem: false,
        row: 3,
        col: 2
    },
    {
        id: "test-folder-13",
        filename: "Personal",
        icon: "/folder.svg",
        type: "folder",
        isSystem: false,
        row: 4,
        col: 2
    },
    {
        id: "test-file-13",
        filename: "Schedule",
        icon: "/document.svg",
        type: "file",
        isSystem: false,
        row: 5,
        col: 2
    },
    {
        id: "test-folder-14",
        filename: "Templates",
        icon: "/folder.svg",
        type: "folder",
        isSystem: false,
        row: 6,
        col: 2
    }
]

const useDesktopStore = create(
    persist(
        (set, get) => ({
            desktopItems: defaultItems,

            //Icon resizing 
            desktopItems: defaultItems,

            iconSize: { width: 46, height: 46 },

            setIconSize: (size) => set({ iconSize: size }),


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
                    icon: type === "folder" ? "/folder.svg" : `/${type}.svg`,
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

            moveItems: (moves, visibleItems) =>{

                const movingIds = new Set(moves.map((move) => move.id))
                const targetCells = new Set()

                for (const move of moves) {
                    if (
                        !Number.isInteger(move.row) ||
                        !Number.isInteger(move.col) ||
                        move.row < 0 ||
                        move.col < 0
                    ) return

                    const key = `${move.row}-${move.col}`

                    if (targetCells.has(key)) return

                    targetCells.add(key)
                } 
                

                const occupied = visibleItems.some((item) => {
                    if (movingIds.has(item.id)) return false

                    return moves.some(
                        (move) => 
                            move.row === item.displayRow &&
                            move.col === item.displayCol
                    )
                })

                if (occupied) return

                const moveMap = new Map(moves.map((move) => [move.id, move]))

                set((state) => ({
                    desktopItems: state.desktopItems.map((item) => {
                        const move = moveMap.get(item.id)

                        return move ? { ...item, row:move.row, col: move.col } : item
                    })
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


