import { Input } from '@/components/ui/input'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import {
    miniFormSchema,
    FormSchema as EntityPostSchema,
} from '@repetition/core/asset/AssetValidators'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Asset } from './image-item-sidebar'
import { Check } from 'lucide-react'
import Link from 'next/link'

interface Props {
    image: Asset
    storeId: string
    linkToEdit?: boolean
}

export function ImageQuickEdit({ image, storeId, linkToEdit = false }: Props) {
    const [loading, setLoading] = useState(false)

    const form = useForm<EntityPostSchema>({
        resolver: zodResolver(miniFormSchema),
        defaultValues: {
            title: image?.title || '',
            caption: image?.caption || '',
            altText: image?.altText || '',
        },
    })
    const success = form.formState.isSubmitSuccessful
    const submitting = form.formState.isSubmitting

    const onSubmit = async (data: EntityPostSchema) => {
        setLoading(true)

        const url = `/api/${storeId}/assets/${image.uuid}`
        try {
            const save = await fetch(url, {
                method: 'PATCH',
                body: JSON.stringify(data),
            })
            if (!save.ok) {
                throw new Error('Error saving asset')
            }
            const response = await save.json()
        } catch (e) {
            // console.log('error saving asset')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid gap-4">
            <div className="space-y-2">
                <h4 className="font-medium leading-none">Quick edit</h4>
                {linkToEdit && <Link 
                    target="_blank" 
                    href={`/${storeId}/assets/${image.uuid}`}
                    className="pt-2 text-sm text-blue-400 hover:underline"
                    >Full edit</Link>}

                {!linkToEdit && (
                    <p className="text-sm text-muted-foreground">
                        Click the image for further editing options.
                    </p>
                )}
            </div>

            <Form {...form}>
                <FormMessage />

                <form
                    className="grid gap-2"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className="grid grid-cols-3 items-center gap-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="mt-4 col-span-3">
                                    <FormLabel className="flex">Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <FormField
                            control={form.control}
                            name="caption"
                            render={({ field }) => (
                                <FormItem className="mt-4 col-span-3">
                                    <FormLabel className="flex">
                                        Caption
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <FormField
                            control={form.control}
                            name="altText"
                            render={({ field }) => (
                                <FormItem className="mt-4 col-span-3">
                                    <FormLabel className="flex">
                                        Alt text
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="mt-4 flex items-center justify-end">
                        {success && !submitting && (
                            <Check className="text-[#46ff8a] h-[30px] w-[30px]" />
                        )}
                        <Button
                            className="ml-6"
                            type="submit"
                            disabled={form.formState.isSubmitting}
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
