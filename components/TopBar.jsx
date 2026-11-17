"use client"

import { useEffect, useRef } from "react"
import BatteryStatus from "./BatteryStatus";



const TopBar = () => {
  return (
    <div className="w-screen bg-background/60 backdrop-blur-2xl backdrop-saturate-150 border-b border-foreground/10 text-foreground">
        <BatteryStatus />
    </div>
  )
}

export default TopBar
