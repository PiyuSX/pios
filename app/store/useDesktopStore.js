import { create } from "zustand"
import { persist } from "zustand/middleware"

const defaultItems = [
           {
        id: "test-file-5",
        filename: "notes.txt",
        icon: "/file.svg",
        type: "file",
        isSystem: true,
        row: 0,
        col: 0,
        content: "Hello Gng!"
    },

]

const useDesktopStore = create(
    persist(
        (set, get) => ({

            //Icon resizing 
            desktopItems: defaultItems,

            iconSize: { width: 46, height: 46 },

            setIconSize: (size) => set({ iconSize: size }),


            //To add new file or folder
            addItem: (filename, type, rows, cols, preferredRow, preferredCol) => {
                const items = get().desktopItems

                if (rows <= 0 || cols <=0 ) return

                let bestPosition = null
                let minDistance = Infinity

                //Finding the next avilavle grid position

                for (let c = 0; c < cols ; c++) {
                    for (let r = 0; r < rows ; r++) {
                        const occupied = items.some(
                            (item) => item.row === r && item.col === c
                        )

                        if (occupied) continue


                   //Calculates Manhattan distance to find closest avi grid cell
                        const distance = Math.abs(r - preferredRow) + Math.abs(c - preferredCol)

                        if (distance < minDistance) {
                            minDistance = distance
                            bestPosition = { row: r, col: c }
                        }
                    }
                }

                if (!bestPosition) return


                const newItem = {
                    id: crypto.randomUUID(),
                    filename,
                    icon: type === "folder" ? "/folder.svg" : `/${type}.svg`,
                    type,
                    isSystem: false,
                    row: bestPosition.row,
                    col: bestPosition.col,
                    content: type === "file" ? "" : undefined
                }

                set((state) => ({
                    desktopItems: [...state.desktopItems, newItem]
                }))

            },


            //Remove but only non system items
            removeItem: (id) => set((state) => ({
                desktopItems: state.desktopItems.filter(
                    (item) => item.id !== id || item.isSystem
                )
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



        //For files

            getFileContent: (id) => {
                const file = get().desktopItems.find((item) => item.id === id)
                return file?.content ?? ""
            },

            updateFileContent: (id, newContent) => set((state) => ({
                desktopItems: state.desktopItems.map((item) =>
                  item.id === id 
                   ? { ...item, content: newContent } : item
                )
            })),

        //Auto Arrange Icons
        autoArrange: (rows, cols) => {
            const items = get().desktopItems

            const updatedItems = [...items]

            let index = 0

            for (let c = 0; c < cols; c++) {
                for (let r = 0; r < rows; r++) {
                    if (index >= items.length) break

                    updatedItems[index] = {
                        ...items[index],
                        row: r,
                        col: c
                    }

                    index++
                }
            }
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


