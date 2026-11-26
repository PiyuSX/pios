import openDatabase from "./database"
import { notify } from "../store/useNotificationStore"

const ROOT_ID = "root"

const SYSTEM_FOLDERS = [
    { id: "system-desktop", name: "Desktop"},
    { id: "system-downloads", name: "Downloads"}
]

const VIRTUAL_FOLDER_IDS = [
    "system-documents",
    "system-pictures",
    "system-music",
    "system-videos"
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
            VIRTUAL_FOLDER_IDS.forEach((id) => {
                if (existingIds.has(id)) {
                    store.delete(id)
                }
            })

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

        let newFile = null
        let error = null
        request.onsuccess = () => {
            const entries = request.result

            const parent = entries.find(
                (entry) => entry.id === parentId
            )

            if (!parent || parent.type !== "folder" || parentId === ROOT_ID) {
                error = new Error("Invalid parent folder: " + parentId)
                transaction.abort()
                return
            }

            const folderName = name.trim()

            const duplicate = entries.some(
                (entry) => 
                    entry.parentId === parentId &&
                    entry.name.toLowerCase() === folderName.toLowerCase()
            )

            if (!name.trim() || duplicate) {
                transaction.abort()
                reject(new Error("Invalid or duplicate name"))
                return
            }

            const now = Date.now()

            const folder = {
                id: crypto.randomUUID(),
                name: folderName,
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


// Create new file


export const createFile = async (name, parentId, content = "") => {
    const db = await openDatabase()

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(
            ["entries", "fileContents"],
            "readwrite"
        )

        const entriesStore = transaction.objectStore("entries")
        const contentStore = transaction.objectStore("fileContents")

        const request = entriesStore.getAll()

        let newFile = null
        let error = null

        request.onsuccess = () => {
            const entries = request.result

            const parent = entries.find(
                (entry) => entry.id === parentId
            )

            if (!parent || parent.type !== "folder" || parentId === ROOT_ID) {
                error = new Error("Invlaid parent folder: " + parentId)
                transaction.abort()
                return
            }
            
            const fileName = name.trim()

            const duplicate = entries.some(
                (entry) => 
                    entry.parentId === parentId &&
                    entry.name.toLowerCase() === fileName.toLowerCase()
            )

            if (!fileName || duplicate) {
                error = new Error(
                    !fileName ? "Filename cant be empty": "A file with this name already exists"
                )

                transaction.abort()
                return
            }

            const now = Date.now()
            const fileId = crypto.randomUUID()

            newFile = {
                id: fileId,
                name: fileName,
                type: "file",
                parentId,
                system: false,
                createdAt: now,
                updatedAt: now
            }

            entriesStore.add(newFile)

            contentStore.add({
                id: fileId,
                content
            })
        }

        request.onerror = () => {
            db.close()
            reject(request.error)
        }

        transaction.oncomplete = () => {
            db.close()
            resolve(newFile)
        }

        transaction.onabort = () => {
            db.close()
            reject(error || transaction.error || new Error("Could not create file"))
        }

        transaction.onerror = () => {
            db.close()
            reject(transaction.error)
        }
    })
}



//Get file content

export const getFileContent = async (fileId) => {
    const db = await openDatabase()

    return new Promise((resolve, reject) => {
        const transaction = db.transaction("fileContents", "readonly")
        const store = transaction.objectStore("fileContents")

        const request = store.get(fileId)
        request.onsuccess = () => {
            if (!request.result) {
                reject(new Error("File not found"))
                return
            }

            resolve(request.result.content)
        }

        request.onerror = () => reject(request.error)
        transaction.oncomplete = () => db.close()

        transaction.onerror = () => {
            db.close()
            reject(transaction.error)
        }
    })
}


// update file content

export const updateFileContent = async (fileId, newContent) => {
    const db = await openDatabase()

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(
            ["entries", "fileContents"],
            "readwrite"
        )

        const entriesStore = transaction.objectStore("entries")
        const contentStore = transaction.objectStore("fileContents")

        const request = entriesStore.get(fileId)
        let error = null

        request.onsuccess = () => {
            const file = request.result

            if (!file || file.type !== "file") {
                error = new Error("File not found")
                transaction.abort()
                return
            }

            file.updatedAt = Date.now()

            entriesStore.put(file)

            contentStore.put({
                id: fileId,
                content: newContent
            })
        }

        transaction.oncomplete = () => {
            db.close()
            resolve(true)
        }

        transaction.onabort = () => {
            db.close()
            reject(error || transaction.error)
        }

        transaction.onerror = () => {
            db.close()
            reject(transaction.error)
        }
    })
}



