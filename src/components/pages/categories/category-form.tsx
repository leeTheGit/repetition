'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash } from 'lucide-react'
import {
    EntitySchema,
    apiInsertSchema,
    FormSchema,
} from '@/core/category/Validators'

import { toast } from 'sonner'
import { Heading } from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AlertModal } from '@/components/modals/alert-modal'
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select'
import { BreadCrumb } from '@/components/breadCrumb'
// import { Delete, create } from "./queries";
import { Delete, create } from '@/hooks/queries'
// import { Textarea } from '@/components/ui/textarea'
// import Link from 'next/link'

interface Props {
    initialData: EntitySchema | null
    courseSlug: string
    courseId: string
    onClose?: () => void
    modal?: boolean
}

const endpoint = 'categories'
const name = 'Category'

export const CategoryForm: React.FC<Props> = ({
    initialData,
    onClose,
    courseSlug,
    courseId,
    modal = false,
}) => {
    const router = useRouter()
    const queryClient = useQueryClient()
    // Delete modal
    const [open, setOpen] = useState(false)
    const title = initialData ? `Edit ${name}` : `New ${name}`
    const toastMessage = initialData ? `${name} updated` : `${name} created`
    const action = initialData ? 'Save changes' : 'Create'

    const mapToForm = (initialData: EntitySchema | null) => {
        const data = {
            name: initialData?.name || '',
            description: initialData?.description || '',
            courseId: initialData?.courseId || courseId
        }
        return data
    }

    const form = useForm<FormSchema>({
        resolver: zodResolver(apiInsertSchema),
        defaultValues: mapToForm(initialData),
    })
    


    // Create or update a category
    const postQuery = useMutation({
        mutationFn: (data: FormSchema) => {
            console.log('the data', data)
            const method = initialData ? 'PATCH' : 'POST'
            const catId = initialData ? initialData.uuid : ''

            return create<FormSchema>(
                data,
                method,
                `/courses/${courseSlug}/${endpoint}/${catId}`
            )
        },
        onSuccess: (response) => {
            toast(toastMessage)
            if (!initialData && !modal) {
                router.push(`course/${courseSlug}/${endpoint}/${response.data.uuid}`)
            }
            queryClient.invalidateQueries({ queryKey: [endpoint] })
        },
        onError: () => {
            toast.error(`${name} failed to save`)
        },
        onSettled: () => {
            router.refresh()
            onClose && onClose()
        },
    })

    // Delete a category
    const deleteQuery = useMutation({
        mutationFn: Delete,
        onSuccess: () => {
            if (!modal) {
                router.refresh()
                router.push(`/course/${courseSlug}/${endpoint}`)
            }
            onClose && onClose()
            queryClient.invalidateQueries({ queryKey: [endpoint] })
            toast.success(`${name} deleted`)
        },
        onError: (e: any) => {
            toast.error(`Error deleting ${name.toLowerCase()} ${e}`)
        },
    })

    const onSubmit = async (data: FormSchema) => {
        postQuery.mutate(data)
    }

    useEffect(() => {
        if (initialData) {
            modal && form.reset(mapToForm(initialData))
        }
    }, [initialData])

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={() =>
                    deleteQuery.mutate(
                        `courses/${courseId}/${endpoint}/${initialData?.uuid}`
                    )
                }
                loading={deleteQuery.isPending}
            />

            <div className="flex  justify-between">
                <div>
                    <Heading title={title} />
                    {!modal && (
                        <BreadCrumb
                            className="mt-2"
                            links={[
                                {
                                    label: "Course",
                                    href: `/course/${courseSlug}`
                                },
                                {
                                    label: 'Categories',
                                    href: `/course/${courseSlug}/${endpoint}`,
                                },
                                { label: initialData?.name || 'New' },
                            ]}
                        />
                    )}
                </div>
                <div className="flex gap-2">
                    {initialData && (
                        <Button
                            disabled={open}
                            variant="destructive"
                            size="icon"
                            onClick={() => setOpen(true)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            <Separator className="my-5" />


            <div className="mt-8 w-full justify-center">
                <div className="max-w-[1000px] m-auto">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8 w-full"
                        >
                            <div className="grid grid-cols-2 gap-8">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem
                                            className={`${!modal ? 'col-span-1' : 'col-span-2'} `}
                                        >
                                            <FormLabel className="flex">
                                                Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Category name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>


                            <div className="flex space-x-4">
                                <Button className="ml-auto" type="submit">
                                    {action}
                                </Button>

                                {modal && (
                                    <Button
                                        type="button"
                                        disabled={postQuery.isPending}
                                        variant="outline"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    )
}
