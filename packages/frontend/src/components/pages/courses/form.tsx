'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    EntitySchema,
    // formSchema,
    apiInsertSchema,
    FormSchema,
} from '@repetition/core/course/Validators'

import { EntitySchema as AssetSchema } from '@repetition/core/asset/AssetValidators'

import { Trash } from 'lucide-react'
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


import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import TinyEditor from '@/components/TinyEditor'
import LogoUpload from '@/components/pages/users/logo-upload'
import { Input } from '@/components/ui/input'
import { AlertModal } from '@/components/modals/alert-modal'
import { BreadCrumb } from '@/components/breadCrumb'
import { Delete, create } from '@/hooks/queries'
import Link from 'next/link'
import useUploadToS3 from '@/hooks/upload-to-s3'
import { ImageUploadModal } from '@/components/modals/image-upload-modal'

type InitialData = EntitySchema

interface Props {
    initialData: (InitialData & { courseImage?: AssetSchema | null }) | null
    courseSlug: string
    courseId: string
    // courseId: string
    onClose?: () => void
    modal?: boolean
}

const endpoint = 'courses'
const name = 'Course'

export const CourseForm: React.FC<Props> = ({
    initialData,
    courseSlug,
    courseId,
    onClose,
    modal = false,
}) => {
    const router = useRouter()
    const queryClient = useQueryClient()

    // Delete modal
    const [open, setOpen] = useState(false)
    const [imageUploadModal, setUploadModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [assetDelete, setAssetDeleteOpen] = useState(false)

    const title = initialData ? `Edit ${name}` : `New ${name}`
    const toastMessage = initialData ? `${name} updated` : `${name} created`
    const action = initialData ? 'Save changes' : 'Create'
    
    const { uploadAsset } = useUploadToS3()

    const mapToForm = (initialData: EntitySchema | null) => {
        const data = {
            name: initialData?.name || '',
            description: initialData?.description || '',
            status: initialData?.status || 'true',
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
            const method = initialData ? 'PATCH' : 'POST'
            const catId = initialData ? initialData.uuid : ''

            return create(data, method, `/${endpoint}/${catId}`)
        },
        onSuccess: (response) => {
            toast(toastMessage)
            if (!initialData && !modal) {
                router.push(`/${endpoint}/${response.data.slug}`)
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

    const deleteQuery = useMutation({
        mutationFn: Delete,
        onSuccess: () => {
            if (!modal) {
                router.refresh()
                router.push(`/${endpoint}/${courseSlug}`)
            }
            onClose && onClose()
            queryClient.invalidateQueries({ queryKey: [endpoint] })
        },
        onError: () => {
            toast.error(`Error deleting ${name.toLowerCase()}`)
        },
        onSettled: () => {
            toast.success(`${name} deleted`)
        },
    })

    const onSubmit = async (data: FormSchema) => {
        postQuery.mutate(data)
    }


    const onDeleteImage = async () => {
        // setLoading(true)
        try {
            const imageDelete = await fetch(
                `/api/${endpoint}/${initialData?.uuid}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify({ profileImageId: null }),
                }
            )
            if (!imageDelete.ok) {
                throw new Error(imageDelete.statusText)
            }

            toast.success('Image deleted')
        } catch (error: any) {
            toast.error(
                'There was an error deleting your image ' + error.message
            )
        } finally {
            router.refresh()
            // setLoading(false)
            setOpen(false)
            setAssetDeleteOpen(false)
        }
    }



    useEffect(() => {
        if (initialData) {
            modal && form.reset(mapToForm(initialData))
        }
    }, [initialData])



    const breadCrumbLinks = [
        { 
            label: 'Courses',
            href: `/${endpoint}`
        },
        { 
            label: initialData?.name || 'New' 
        },
    ]

    if (initialData?.name) {
        breadCrumbLinks.push({
            label: 'Problems',
            href: `/${endpoint}/${courseSlug}/problems`,
        })
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                message={`Are you sure you want to delete this ${name.toLowerCase()}?`}
                onConfirm={() =>
                    deleteQuery.mutate(
                        `${endpoint}/${initialData?.uuid}`
                    )
                }
                loading={deleteQuery.isPending}
            />
            <ImageUploadModal
                isOpen={imageUploadModal}
                message="Add avatar"
                onClose={() => setUploadModal(false)}
                loading={loading}
                onConfirm={async (file) => {
                    const url = await uploadAsset(file, {
                        entity_uuid: initialData?.uuid,
                        entity: 'course',
                        attribute: 'imageUuid',
                        type: 'banner',
                        assetType: 'image',
                    })
                    router.refresh()
                    return true
                }}
            />

            {assetDelete && (
                <AlertModal
                    isOpen={true}
                    message={`Are you sure you want to delete this image?`}
                    onClose={() => setAssetDeleteOpen(false)}
                    onConfirm={() => onDeleteImage()}
                    loading={loading}
                />
            )}


            <div className="flex flex-col px-8 justify-between">
                <div className="flex">

                    <div>
                        <Heading title={title} />
                        <BreadCrumb
                            className="mt-2"
                            links={breadCrumbLinks}
                        />
                    </div>
                    <div className="ml-auto flex gap-2">
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
            </div>


            
            <div className={`mt-20  w-full justify-center`}>
                <div className="">

                    <div className="mt-8 w-full justify-center">
                        <div className="max-w-[1000px] m-auto">                        
                            <LogoUpload
                                logo={initialData?.courseImage}
                                type="default"
                                onOpen={() => setUploadModal(true)}
                                onDelete={() => setAssetDeleteOpen(true)}
                            />
                        </div>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="pt-10"
                        >
                            <div className="max-w-[1000px] m-auto grid grid-cols-12 gap-8">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="col-span-10">
                                            <FormLabel className="flex">
                                                Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                
                                <FormField
                                    control={form.control}
                                    name="status"
                                    
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col items-end justify-end col-span-2">
                                            <FormLabel>Active</FormLabel>
                                            <div className="h-10 flex items-center">
                                                <Switch
                                                    checked={!!field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="max-w-[1000px] m-auto mt-10 grid grid-cols-12 gap-2">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="col-span-12">
                                        <FormLabel className="flex">
                                           Short description
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            </div>

                            <div className="max-w-[1000px] m-auto flex mt-10">
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
