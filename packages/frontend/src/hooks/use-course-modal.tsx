import { create } from 'zustand'

interface Props {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

export const useCourseModal = create<Props>((set) => ({
    isOpen: false,
    onOpen: () => {
        console.log('setting is open')
        set({ isOpen: true })
    },
    onClose: () => set({ isOpen: false }),
}))
