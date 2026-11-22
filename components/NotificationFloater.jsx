import { useEffect, useState } from 'react'
import useNotificationStore from '@/app/store/useNotificationStore'
import { motion, AnimatePresence } from "motion/react"

const NotificationFloater = () => {
  const notifications =  useNotificationStore((state) => state.notifications)

  const markAsShown = useNotificationStore(
    (state) => state.markAsShown
  )

  const [activeNotification, setActiveNotification] = useState(null)

  useEffect(() => {
    if (activeNotification) return

    const nextNotification = notifications.find(
      (item) => !item.shown
    )

    if (nextNotification) {
      setActiveNotification(nextNotification)

      if (nextNotification.soundName) {
        const audio = new Audio(`/sounds/${nextNotification.soundName}`)
        audio.volume = 0.8
        audio.play().catch(() => {})
      }
      markAsShown(nextNotification.id)
    }
  }, [notifications, activeNotification, markAsShown])


  //Display for the given duration 

  useEffect(() => {
    if (!activeNotification) return

    const timer = setTimeout(() => {
      setActiveNotification(null)

    }, activeNotification.duration ?? 4000)

    return () => clearTimeout(timer)
  }, [activeNotification])

  return (
    <div className="z-99999 fixed right-15 top-15 text-background">
      <AnimatePresence mode="wait">
      {activeNotification && (
        <motion.div
        key={activeNotification.id}
        initial={{opacity: 0, x: 40}}
        animate={{opacity: 1, x: 0}}
        exit={{opacity:0, x: 40}}
        transition={{duration: 0.3, ease: "easeOut"}}
        className="w-80 rounded-xl p-4 shadow-lg bg-background/10 border border-background/15  backdrop-blur-[5px]">
          <h2 className='text-lg font-semibold'>{activeNotification.heading}</h2>
          <p className='text-sm'>{activeNotification.message}</p>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationFloater

