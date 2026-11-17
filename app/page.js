"use client"

import Image from "next/image";
import Logo from "@/components/Logo";
import { useState } from "react";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      {!showLogin ? <Logo setShowLogin={setShowLogin} /> : 
      <div>
      <Image className="absolute" src="/forest.jpg" alt="Flower Ground" fill={true} />
      <div>
        
      </div>
      </div>}
    </div>
  );
}
