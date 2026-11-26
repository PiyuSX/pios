"use client"

import { useEffect, useRef } from "react"

import {
    initializeFilesystem,
    createFile,
    getFileContent,
    updateFileContent
} from "@/app/filesystem/filesystem"

export default function FilesystemTest() {
    const hasRun = useRef(false)
    useEffect(() => {

        if (hasRun.current) return
        hasRun.current = true
        const testFilesystem = async () => {
            try {
                await initializeFilesystem()

                const file = await createFile(
                    "browser-test-4.txt",
                    "system-desktop",
                    "Hello from PiOS!"
                )

                console.log("Created:", file)
                console.log("Original:", await getFileContent(file.id))

                await updateFileContent(
                    file.id,
                    "PiOS filesystem is working!"
                )

                console.log("Updated:", await getFileContent(file.id))
                console.log("TEST PASSED!")
            } catch (error) {
                console.error("TEST FAILED:", error)
            }
        }

        testFilesystem()
    }, [])

    return null
}