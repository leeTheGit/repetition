'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PlusCircle, PlusSquare, Trash } from 'lucide-react'
import { EntitySchema, insertSchema, FormSchema } from '@repetition/core/user/Validators'
import { EntitySchema as AssetSchema } from '@repetition/core/asset/AssetValidators'

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'
import { AlertModal } from '@/components/modals/alert-modal'
import { BreadCrumb } from '@/components/breadCrumb'
import { Delete, create } from '@/hooks/queries'
import Overlay from '@/components/overlay'
import { ImageUploadModal } from '@/components/modals/image-upload-modal'
import useUploadToS3 from '@/hooks/upload-to-s3'
import LogoUpload from '@/components/pages/users/logo-upload'
import Link from 'next/link'
type InitialData = Pick<
    EntitySchema,
    'uuid' | 'username' | 'email' | 'firstname' | 'lastname'
>

interface Props {
    initialData: (InitialData & { profileImage?: AssetSchema | null }) | null
    onClose?: () => void
    modal?: boolean
}

const endpoint = 'users'
const name = 'User'

export const UserForm: React.FC<Props> = ({
    initialData,
    onClose,
    modal = false,
}) => {
    const router = useRouter()
    const queryClient = useQueryClient()
    // Delete modal
    const [open, setOpen] = useState(false)
    const [imageUploadModal, setUploadModal] = useState(false)
    const [assetDelete, setAssetDeleteOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const { uploadAsset } = useUploadToS3()


    const title = initialData ? `Edit ${name}` : `New ${name}`
    const toastMessage = initialData ? `${name} updated` : `${name} created`
    const action = initialData ? 'Save changes' : 'Create'

    const mapToForm = (initialData: InitialData | null) => {
        return {
            username: initialData?.username || '',
            firstname: initialData?.firstname || '',
            lastname: initialData?.lastname || '',
            email: initialData?.email || '',
            // role: initialData?.role || '',
        }
    }

    const form = useForm<FormSchema>({
        resolver: zodResolver(insertSchema),
        defaultValues: mapToForm(initialData),
    })

    // Create or update a category
    const postQuery = useMutation({
        mutationFn: (data: FormSchema) => {
            const method = initialData ? 'PATCH' : 'POST'
            const catId = initialData ? initialData.uuid : ''

            return create<FormSchema>(
                data,
                method,
                `/${endpoint}/${catId}`
            )
        },
        onSuccess: (response) => {
            toast(toastMessage)
            if (!initialData && !modal) {
                router.push(`/${endpoint}/${response.data.uuid}`)
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
                router.push(`/${endpoint}`)
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
                        `/${endpoint}/${initialData?.uuid}`
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
                        entity: 'user',
                        attribute: 'profileImageId',
                        type: 'avatar',
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

            {form.formState.isSubmitting && <Overlay />}

            <div className="flex  justify-between">
                <div>
                    <Heading title={title} />
                    {!modal && (
                        <BreadCrumb
                            className="mt-2"
                            links={[
                                {
                                    label: 'Users',
                                    href: `/${endpoint}`,
                                },
                                { label: initialData?.email || 'New' },
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
                <div className="max-w-[800px] m-auto">
                    {!modal && (
                        <div className={`mt-10 mb-10 flex flex-row`}>
                            <LogoUpload
                                logo={initialData?.profileImage}
                                type="default"
                                onOpen={() => setUploadModal(true)}
                                onDelete={() => setAssetDeleteOpen(true)}
                            />
                        </div>
                    )}

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8 w-full "
                        >
                            <div className="grid grid-cols-2 gap-8">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="firstname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
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
