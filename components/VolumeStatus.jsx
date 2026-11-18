"use client"


import { useEffect, useState, useRef } from "react"
import { FiVolume2, FiVolume1, FiVolumeX } from "react-icons/fi"

const VolumeStatus = () => {
    const [volume, setVolume] = useState(50)
    const [muted, setMuted] = useState(false)
    const [open, setOpen] = useState(false)
    
    const volumeRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(e) {
            if (volumeRef.current && !volumeRef.current.contains(e.traget)) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const toggleMute = () => {
        setMuted(!muted)
    }

    const handleVolumeChange = (e) => {
        const value = Number(e.target.value)
        setVolume(value)

        if (value > 0 ) {
            setMuted(false)
        }
    }

    const VolumeIcon = muted || volume === 0 ? FiVolumeX : volume < 50 ? FiVolume1 : FiVolume2
  return (
    <div className="relative group" ref={volumeRef}>
        <div className="flex items-center">
        <button onClick={() => setOpen(!open)} className="rounded-md hover:bg-background/10 transition"
            >
                <VolumeIcon size={16} />

        </button>
        </div>

        {open && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-background/10 bg-foreground p-4 shadow-xl z-50">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Volume</span>
                    <button onClick={toggleMute}
                        className="p-2 rounded-md hover:bg-background/10"
                    >{muted || volume === 0 ? (
                        <FiVolumeX size={18} />
                    ): (
                        <FiVolume2 size={18} />
                    )}</button>
                </div>

                <div className="flex items-center gap-3">
                <FiVolumeX size={18} />
                <input type="range" min="0" max="100" value={muted ? 0 : volume}  
                onChange={handleVolumeChange} className="w-full cursor-pointer" />
                <span className="text-xs w-9 text-right tabular-nums">
                    {muted ? 0 : volume}%
                </span>
                </div>
            </div>
        )}

 <div className="absolute hidden group-hover:block top-full right-0 mt-1 p-2 bg-foreground/60 backdrop:blur-2xl text-background text-xs z-50 rounded whitespace-nowrap">
    {volume}% {muted ? "(Muted)" : "Volume"}
 </div>
    </div>
  )
}

export default VolumeStatus
