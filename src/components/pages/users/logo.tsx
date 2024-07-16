import React from 'react'
import Image from 'next/image'
import { Pencil, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ImageQuickEdit } from '@/components/pages/users/image-quick-edit'

interface Props {
    storeId: string
    image: {
        uuid: string
        cdnUrl: string
        title: string
        caption: string
        altText: string
    }
    deleteHandler: (uuid: string) => void
}

const Logo = ({ image, storeId, deleteHandler }: Props) => {
    return (
        <div
            key={image.uuid}
            className="relative cursor-pointer flex items-center gap-4"
        >
            <div className="group/image w-[200px] h-[200px] rounded-md overflow-hidden">
                <div className="group-hover/image:flex space-x-2  z-10 absolute top-2 right-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                className="h-9 w-9 p-2 bg-transparent group-hover/image:bg-black"
                                // className="z-50 group/edit h-6 w-6 p-0 group-hover/image:flex "
                                type="button"
                                variant="ghost"
                            >
                                <Pencil
                                    className="font-light dark:text-[#161f33]  group-hover/image:opacity-1 group-hover/image:text-gray-400  dark:group-hover/image:text-gray-600 dark:group-hover/edit:!text-white group-hover/edit:!text-black h-9 w-9 "
                                    strokeWidth={1.5}
                                />
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="dark:bg-black w-[450px]">
                            <ImageQuickEdit
                                image={image}
                                storeId={storeId}
                                linkToEdit={true}
                            />
                        </PopoverContent>
                    </Popover>

                    <Button
                        className="h-9 w-9 p-2 bg-transparent group-hover/image:bg-red-500"
                        type="button"
                        onClick={() => deleteHandler(image.uuid)}
                        variant="destructive"
                    >
                        <Trash className="h-4 w-4 hidden group-hover/image:flex" />
                    </Button>
                </div>
                <Image
                    fill
                    className="object-cover"
                    alt="Product image"
                    src={image.cdnUrl}
                />
            </div>
        </div>
    )
}

export default Logo
