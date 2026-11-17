"use client"

import { useEffect } from "react"

export default function useDisableContextMenu() {
    useEffect(() => {
        const disableInteraction = (e) => e.preventDefault()

        document.addEventListener("contextmenu", disableInteraction)
        document.addEventListener("dragstart", disableInteraction)

        return () => {
            document.removeEventListener("contextmenu", disableInteraction)
            document.removeEventListener("dragstart", disableInteraction)
        }
    }, [])
}