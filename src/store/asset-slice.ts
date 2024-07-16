import { create } from 'zustand';
import { toast } from "sonner"


type Asset = {
    uuid: string
    title: string
    url:string
    caption:string
    altText:string
    cdnUrl:string
}

interface AssetStore {
    items: Asset[];
    addAll: (data: Asset[] | undefined) => void;
    addItem: (data: Asset) => void;
    removeItem: (id: string) => void;
    removeAll: () => void;
}

const useAssetStore = create<AssetStore>(
    (set, get) => ({
        items: [],
        addAll: (data: Asset[] | undefined) => {
            set({ items: data });
            // toast.success('all items added.');
        },
        addItem: (data: Asset) => {
            set((state) => ({ items: [...state.items, data] }));
            // toast.success('Item added to assets.');
        },
        removeItem: (uuid: string) => {
            set({ items: [...get().items.filter((item) => item.uuid !== uuid)] });
            // toast.success('Item removed from assets.');
        },
        removeAll: () => set({ items: []}),
}));

export default useAssetStore;
