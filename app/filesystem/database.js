const DB_NAME = "pios-filesystem"
const DB_VERSION = 1

const openDatabase = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onupgradeneeded = (e) => {
            const db = e.target.result

            if (!db.objectStoreNames.contains("entries")) {
                db.createObjectStore("entries", {
                    keyPath: "id"
                })
            }

            if (!db.objectStoreNames.contains("fileContents")) {
                db.createObjectStore("fileContents", {
                    keyPath: "id"
                })
            }
        }

        request.onsuccess = () => {
            resolve(request.result)
        }

        request.onerror = () => {
            reject(request.error)
        }
    })
}


export default openDatabase