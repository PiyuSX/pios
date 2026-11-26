import openDatabase from "./database"
import { notify } from "../store/useNotificationStore"

const ROOT_ID = "root"

const SYSTEM_FOLDERS = [
    { id: "system-desktop", name: "Desktop"},
    { id: "system-downloads", name: "Downloads"},
    { id: "system-documents", name: "Documents"},
    { id: "system-pictures", name: "Pictures"},
    { id: "system-music", name: "Music" },
    { id: "system-videos", name: "Videos" }
]

//root & system folders

export const initializeFilesystem = async () => {
    const db = await openDatabase()

    return new Promise((resolve, reject) => {
        const transaction = db.transaction("entries", "readwrite")
        const store = transaction.objectStore("entries")

        const request = store.getAll()

        request.onsuccess = () => {
            const existingIds = new Set(
                request.result.map((entry) => entry.id)
            )

            const now = Date.now()

            if (!existingIds.has(ROOT_ID)) {
                store.add({
                    id: ROOT_ID,
                    name: "root",
                    type: "folder",
                    parentId: null,
                    system: true,
                    createdAt: now,
                    updatedAt: now
                })
            }

            SYSTEM_FOLDERS.forEach((folder) => {
                if (existingIds.has(folder.id)) return

                store.add({
                    ...folder,
                    type: "folder",
                    parentId: ROOT_ID,
                    system: true,
                    createdAt: now,
                    updatedAt: now
                })
            })
        }

        request.onerror = () => reject(request.error)

        transaction.oncomplete = () => {
            db.close()
            resolve()
        }

        transaction.onerror = () => {
            db.close()
            reject(transaction.error)
        }
        
    })
}


// all items inside a folder

export const getFolderContents = async (parentId) => {
    const db = await openDatabase()

    return new Promise((resolve, reject) => {
        const transaction = db.transaction("entries", "readonly")
        const store = transaction.objectStore("entries")

        const request = store.getAll()

        request.onsuccess = () => {
            const contents = request.result.filter(
                (entry) => entry.parentId === parentId
            )
            resolve(contents)
        }

        request.onerror = () => reject(request.error)

        transaction.oncomplete = () => db.close()
        transaction.onerror = () => reject(transaction.error)
    })
}


// Create new folder

export const createFolder = async (name, parentId) => {
    const db = await openDatabase()

    return new Promise((resolve, reject) => {
        const transaction = db.transaction("entries", "readwrite")
        const store = transaction.objectStore("entries")

        const request = store.getAll()

        request.onsuccess = () => {
            const entries = request.result

            const parent = entries.find(
                (entry) => entry.id === parentId
            )

            if (!parent || parent.type !== "folder" || parentId === ROOT_ID) {
                transaction.abort()
                reject(new Error("Invalid parent folder"))
                return
            }

            const duplicate = entries.some(
                (entry) => 
                    entry.parentId === parentId &&
                    entry.name.toLowerCase() === name.trim().toLowerCase()
            )

            if (!name.trim() || duplicate) {
                transaction.abort()
                reject(new Error("Invalid or duplicate name"))
            }

            const now = Date.now()

            const folder = {
                id: crypto.randomUUID(),
                name: name.trim(),
                type: "folder",
                parentId,
                system: false,
                createdAt: now,
                updatedAt: now
            }

            store.add(folder)

            resolve(folder)
        }

        request.onerror = () => reject(request.error)

        transaction.oncomplete = () => db.close()

        transaction.onerror = () => {
            db.close()
            reject(transaction.error)
        }
    })
}