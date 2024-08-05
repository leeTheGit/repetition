import React, { useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { useRouter } from 'next/navigation'
// import { zodResolver } from '@hookform/resolvers/zod'
// import {
//     miniFormSchema,
//     FormSchema as EntityPostSchema,
// } from '@repetition/core/asset/AssetValidators'
import { Button } from '@/components/ui/button'
import { Download, Pencil, Trash } from 'lucide-react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { toast } from 'sonner'
import { deleteAsset } from '@repetition/core/asset/actions/deleteAsset'
import { AlertModal } from '@/components/modals/alert-modal'
import useAssetStore from '@/store/asset-slice'
import { ImageQuickEdit } from './image-quick-edit'

export type Asset = {
    uuid: string
    title: string
    // url: string
    caption: string
    altText: string
    cdnUrl: string
}

interface Props {
    image: Asset
    storeId: string
}

const ImageItemSidebar = ({ image, storeId }: Props) => {
    const [loading, setLoading] = useState(false)
    const [assetDelete, setOpen] = useState(false)

    const removeAsset = useAssetStore((state) => state.removeItem)

    const onDelete = async () => {
        setLoading(true)

        try {
            const del = await fetch(`/api/${storeId}/assets/${image.uuid}`, {
                method: 'DELETE',
            })
            if (!del.ok) {
                const body = await del.json()
                throw new Error(body)
            }

            removeAsset(image.uuid)
            const keySplit = image?.cdnUrl.split('/sites')
            const key = keySplit ? 'sites' + keySplit[1] : ''
            deleteAsset(key)
            toast.success('Asset deleted')
        } catch (error: any) {
            toast.error('Sorry, ' + error.message)
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal
                isOpen={assetDelete}
                message="Are you sure you want to delete this asset?"
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        className="group/edit h-6 w-6 p-0 hover:bg-transparent "
                        type="button"
                        variant="ghost"
                    >
                        <Pencil
                            className="font-light text-gray-100 dark:text-[#161f33] group-hover/image:text-gray-400  dark:group-hover/image:text-gray-600 dark:group-hover/edit:!text-white group-hover/edit:!text-black h-6 w-6 "
                            strokeWidth={1.5}
                        />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="dark:bg-black w-[450px]">
                    <ImageQuickEdit image={image} courseId="23" />
                </PopoverContent>
            </Popover>

            <Button
                onClick={() => setOpen(true)}
                className="group/edit h-7 w-7 p-0 hover:bg-transparent"
                type="button"
                variant="ghost"
            >
                <Trash className="font-light text-gray-400 dark:text-gray-600 h-7 w-7 dark:hover:text-white hover:text-black hover:bg-transparent hidden group-hover/image:flex" />
            </Button>

            <Button
                className="!mt-auto group/edit h-7 w-7 p-0 hover:bg-transparent"
                type="button"
                variant="ghost"
            >
                <Download className="font-light text-gray-400 dark:text-gray-600 h-7 w-7 dark:hover:text-white hover:text-black hover:bg-transparent hidden group-hover/image:flex" />
            </Button>
        </>
    )
}

export default ImageItemSidebar
