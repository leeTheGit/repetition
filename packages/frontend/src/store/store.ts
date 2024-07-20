import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'
import { createSeedSlice, SeedSlice } from './seed-slice'
export type Store = SeedSlice

export const useStore = create<Store>()(
    devtools(
        immer((...a) => ({
            ...createSeedSlice(...a),
        }))
    )
)
