import { useEffect, useState } from 'react'
import useNotificationStore from '@/app/store/useNotificationStore'

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
      {activeNotification && (
        <div className="w-80 rounded-xl p-4 shadow-lg bg-background/10 border border-background/15  backdrop-blur-[5px]">
          <h2 className='text-lg font-semibold'>{activeNotification.heading}</h2>
          <p className='text-sm'>{activeNotification.message}</p>
        </div>
      )}
    </div>
  )
}

export default NotificationFloater

