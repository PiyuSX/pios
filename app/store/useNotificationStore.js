import { create } from "zustand"

const useNotificationStore = create((set) => ({
    notifications: [],
    addNotification: (notification) => 
        set((state) => ({ notifications: [...state.notifications, notification]})),

    markAsShown: (id) => 
        set((state) => ({
            notifications: state.notifications.map((item) => 
                item.id === id ? {...item, shown: true } : item
            )
        })),

    removeNotification: (id) => 
        set((state) => ({
            notifications: state.notifications.filter(
                (item) => item.id !== id
            )
        })),
    clearNotifications: () => set({
        notifications: []
    })
})
)


//Making it easy to useee
export const notify = (heading, message, duration = 3500, soundName = "meow.wav" ) => {
    useNotificationStore.getState().addNotification({
        id: crypto.randomUUID(),
        heading,
        message,
        duration,
        shown: false,
        soundName
    })
}

export default useNotificationStore