"use client"

import Logo from "@/components/Logo"
import { useState } from "react"

export default function Home() {
  const [showLogin, setShowLogin] = useState(false)
  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <Logo setShowLogin={setShowLogin} />
    </div>
  )
}
