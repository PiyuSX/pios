"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { LuChevronRight, LuExternalLink } from "react-icons/lu"


const menu = [
    {
        label: "New Folder",
        type: "action",
        action: "new-folder"
    },
    {
        label: "New File",
        type: "action",
        action: "new-file"
    },
    {
        separator: true
    },
    {
        label: "Socials",
        type: "submenu",
        items: [
            {
                label: "Github",
                type: "link",
                href: "https://github.com/piyusx"
            },
            {
                label: "Linkedin",
                type: "link",
                href: "https://www.linkedin.com"
            },
            {
                label: "Instagram",
                type: "link",
                href: "https://www.instagram.com/piyusx"
            }
        ]
    },
    {
        label: "View",
        type: "submenu",
        items: [
            {
                label: "Large Icons",
                type: "action",
                action: "large-icons"
            },
            {
                label: "Medium Icons",
                type: "action",
                action: "medium-icons"
            },
            {
                label: "Small Icons",
                type: "action",
                action: "small-icons"
            },
            {
                label: "Auto Aarrange",
                type: "action",
                action: "auto-arrange"
            }
        ]
    },
    {
        separator: true
    },
    {
        label: "Display Settings",
        type: "action",
        action: "display-settings"
    }
]

const selectedMenu = [
        {
            label: "Rename",
            type: "action",
            action: "rename"
        },
        {
            label: "Delete",
            type: "action",
            action: "delete"
        }
    ]




const Submenu = ({ item, onClose, onAction }) => {
    const [open, setOpen] = useState(false)
    const [position, setPosition] = useState({ left: 0, top: 0})

    const triggerRef = useRef(null)
    const menuRef = useRef(null)
    const closeTimer = useRef(null)

    const cancelClose = () => {
        clearTimeout(closeTimer.current)
    }

    const scheduleClose = () => {
        closeTimer.current = setTimeout(() => {
            setOpen(false)
        }, 180)
    }

    const openMenu = () => {
        cancelClose()

        const rect = triggerRef.current.getBoundingClientRect()

        setPosition({
            left: rect.right,
            top: rect.top
        })

        setOpen(true)
    }

    

    //keeping the submuenu inside the viewport

    useEffect(() => {
        if (!open || !menuRef.current || !triggerRef.current) return

        const triggerRect = triggerRef.current.getBoundingClientRect()

        const menuRect = menuRef.current.getBoundingClientRect()

        const left = triggerRect.right + menuRect.width > window.innerWidth
            ? triggerRect.left - menuRect.width
            : triggerRect.right

        const top = Math.max(8, Math.min(triggerRect.top, window.innerHeight - menuRect.height - 8))

        setPosition({ left, top })
    }, [open])

    useEffect(() => {
        return () => clearTimeout(closeTimer.current)
    }, [])






return (
    <>
     <button
      ref={triggerRef}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onClick={() => setOpen((prev) => !prev)}
      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[12px] hover:bg-background/10"
     >
        {item.label}
        <LuChevronRight size={14} className="opacity-60" />
     </button>

     {open && createPortal(
        <div 
         ref={menuRef}
         onMouseEnter={cancelClose}
         onMouseLeave={scheduleClose}
         className="fixed z-10000 w-48 rounded-lg border border-background/10 bg-background/10 p-1.5 text-background shadow-xl backdrop-blur-[5px]"
         style={{
            left: position.left,
            top: position.top
         }}
        >
            <MenuItems
            items={item.items}
            onClose={onClose}
            onAction={onAction}
            />
            
        </div>,
        document.body
     )}
    </>
)
}


//Menu item renderer 

const MenuItems = ({ items, onClose, onAction }) => {
    return items.map((item, index) => {
        if (item.separator) {
            return (
                <div 
                 key={index}
                 className="my-1 border-t border-background/10"
               />   
            )
        }

        if (item.type === "submenu") {
            return (
                <div key={index}>
                    <Submenu
                     item={item}
                     onClose={onClose}
                     onAction={onAction}
                    />
                </div>
            )
        }

        return (
            <button
             key={index}
             className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[12px] hover:bg-background/10"
             onClick={() => {
                if (item.type === "link") {
                    window.open(item.href, "_blank", "noopener noreferrer")
                    onClose()
                    return
                }

                if (item.type === "action") {
                    onAction?.(item.action)
                    onClose()
                }
             }}  
            >
                {item.label}

                {item.type === "link" && <LuExternalLink size={14} className="opacity-50" />}

            </button>
        )
    })
}

 


// Main context menu 
const DesktopContextMenu = ({ x, y, onClose, onAction, selectedId = [] }) => {

    let currentMenu = menu

    if (selectedId.length === 1) {
        currentMenu = selectedMenu
    }
    if (selectedId.length > 1) {
        currentMenu = selectedMenu.filter((item) => item.action === "delete")
    }

    return (
        <div
         className="fixed z-50 w-52 rounded-lg border border-background/10 bg-background/10 text-background shadow-xl backdrop-blur-[5px] p-1.5"
         style={{
            left: x, top: y
         }}
         onContextMenu={(e) => e.preventDefault()}
        >
            <MenuItems
             items={currentMenu}
             onClose={onClose}
             onAction={onAction}
            />
        </div>
    )
}



export default DesktopContextMenu