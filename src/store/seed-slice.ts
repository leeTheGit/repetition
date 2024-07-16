import { StateCreator } from 'zustand'

export type SeedSlice = {
    enabled: boolean
    seedFetched: boolean
    enable: () => void
    disenable: () => void
    fetchSeed: (storeId: string) => Promise<void>
}

export const createSeedSlice: StateCreator<
    SeedSlice,
    [['zustand/immer', never]],
    [],
    SeedSlice
> = (set) => ({
    seedFetched: false,
    enabled: false,
    enable: () => {
        set((state) => {
            state.enabled = true
        })
    },
    disenable: () => {
        set({
            enabled: false,
            seedFetched: true,
        })
    },
    fetchSeed: async (storeId: string) => {
        const res = await fetch(`/api/${storeId}/products`)
        if (!res.ok) {
            throw new Error(`Failed to get products`)
        }
        const products = await res.json()
        if (products.data.length === 0) {
            set({
                enabled: true,
            })
        }
        set({ seedFetched: true })
    },
})
