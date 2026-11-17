import Image from "next/image";
import { useState, useEffect } from "react";

const LockScreen = ({ setCurrentScreen }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const date = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        setCurrentScreen("desktop");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setCurrentScreen]);

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden text-white">
    <Image
    className="absolute inset-0 object-cover"
    src="/forest.jpg"
    alt="Flower Ground"
    fill
    priority
/>
      <div className="relative">
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
          <div className="flex flex-col items-center ">
            <p className="text-6xl font-semibold tracking-tight">{time}</p>
            <p className="font-medium mt-1">{date}</p>
          </div>
          <Image
            className=" rounded-full mt-10"
            src="/profile.jpg"
            alt="Profile"
            width={140}
            height={140}
          />
          <p className="text-xl mt-3">@piyusx</p>
          <button
            onClick={() => setCurrentScreen("desktop")}
            className="mt-6 px-8 py-3 rounded-full bg-white/10 backdrop-blur-[2px] border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all duration-300 cursor-pointer"
          >
            Enter PiOS
          </button>
          <p className="text-xs mt-3 text-[#a1a1aa]">Press Enter to continue</p>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;

