"use client"

import BatteryStatus from "./BatteryStatus";
import { FaGithub, FaLinkedinIn, FaInstagram, FaDiscord } from "react-icons/fa6";
import { IoLockClosed } from "react-icons/io5"
// import VolumeStatus from "./VolumeStatus";

const socials = [
    {name: "Github", href:"https://github.com/PiyuSX", icon: <FaGithub />},
    {name: "LinkedIn", href:"https://www.linkedin.com/in/piyush-rajbanshi-038808317/", icon: <FaLinkedinIn />},
    {name: "Instagram", href:"https://www.instagram.com/piyusx.builds/", icon: <FaInstagram />},
    {name: "Discord", href:"https://discord.com/users/932975786997219368", icon: <FaDiscord />}
]

const TopBar = ({setCurrentScreen}) => {
  return (
    <div className="w-screen bg-background/60 backdrop-blur-2xl backdrop-saturate-150 border-b border-foreground/10 text-foreground flex items-center justify-between px-4">
        <div className="flex text-sm gap-3 font-medium ">
          <p>PiOS</p>
          <p>@Piyusx</p>
        </div>
        <div className="flex gap-3">
         {socials.map((social) => (
            <a className="transition-transform duration-200 hover:scale-125" key={social.name} href={social.href} target="_blank" rel="noopener noreferrer">
              {social.icon}
            </a>
         ))}
        </div>
        <div className="flex gap-2 items-center">
        <BatteryStatus />
        {/* <VolumeStatus /> */}
        <div onClick={() => setCurrentScreen("lockscreen")} className="cursor-pointer relative group">
        <IoLockClosed />
        <div className="absolute hidden group-hover:block top-full right-0 mt-1 p-2 bg-foreground/60 backdrop-blur-2xl text-background text-xs rounded z-50 whitespace-nowrap">
          <p>Lock Screen</p>
        </div>
        </div>
        </div>
    </div>
  )
}

export default TopBar
