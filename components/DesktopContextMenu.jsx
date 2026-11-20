"use client"

import { LuChevronRight, LuExternalLink } from "react-icons/lu"

const menu = [
    {
        label: "New",
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
        label: "Refresh",
        type: "action",
        action: "refresh"
    },
    {
        label: "Display Settings",
        type: "action",
        action: "display-settings"
    }
]

const DesktopContextMenu = ({ x, y, onClose, onAction }) => {
    const renderItems = (items) => {
        return items.map((item, index) => {
            if (item.separator) {
                return (
                    <div key={index} className="my-1 border-t border-background/10" />
                )
            }

            if (item.type === "submenu") {
                return (
                    <div key={index} className="relative group">
                        <button className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[12px] hover:bg-background/10">
                            {item.label}
                            <LuChevronRight size={14} className="opacity-60" />
                        </button>

                        <div 
                          className="absolute left-full top-0 ml-1 w-48 rounded-lg hidden border border-background/10 bg-background/10 p-1.5 shadow-xl backdrop-blur-2xl group-hover:block"
                          >
                            {renderItems(item.items)}
                        </div>

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

                    {item.type === "link" && (
                        <LuExternalLink size={12} className="opacity/50" />
                    )}

                </button>
            )
        })
    }

    return (
        <div className="fixed z-50 w-52 rounded-lg border border-background/10 bg-background/10 text-background  shadow-xl backdrop-blur-[5px]"
         style={{ left: x, top: y }}
         onContextMenu={(e) => e.preventDefault()}
        >
            {renderItems(menu)}
        </div>
    )
}

export default DesktopContextMenu