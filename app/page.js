"use client";

import Boot from "@/components/Boot";
import LockScreen from "@/components/LockScreen";
import Desktop from "@/components/Desktop";
import { useState, useEffect } from "react";
import useDisableContextMenu from "./hooks/useDisableContextMenu";
import { AnimatePresence, motion } from "framer-motion";
import useHasSeenBoot from "./store/useBootStore";
import NotificationFloater from "@/components/NotificationFloater";
import FilesystemTest from "@/components/FilesystemTest";

export default function Home() {
  useDisableContextMenu();

  const { hasSeenBoot, setHasSeenBoot } = useHasSeenBoot()
  const [currentScreen, setCurrentScreen] = useState("lockscreen");

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])


  if (!mounted) {
    if (hasSeenBoot) {
      return <LockScreen />
    }
    return <div className="w-screen h-screen bg-black" />
  }


  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {!hasSeenBoot ? (
        <div className="flex w-full h-full items-center justify-center">
          <Boot setHasSeenBoot={setHasSeenBoot} />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {currentScreen === "lockscreen" ? (
            <motion.div
              className="absolute inset-0 w-full h-full"
              key="lock"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LockScreen setCurrentScreen={setCurrentScreen} />
            </motion.div>
          ) : (
            <motion.div
              className="absolute inset-0 w-full h-full"
              key="desktop"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Desktop setCurrentScreen={setCurrentScreen} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
      <NotificationFloater />
      <FilesystemTest />
    </div>
  );
}
