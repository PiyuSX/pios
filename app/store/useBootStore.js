import { create } from "zustand"
import { persist } from "zustand/middleware"

const useBootStore = create(
    persist(
        (set) => ({
            hasSeenBoot: false,
            setHasSeenBoot: (value) => set({ hasSeenBoot: value }),

        }),
        {
            name: "has-seen-boot"
        }
    )
)

export default useBootStore