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
import Editor from '@monaco-editor/react'
// import { FormModal } from '@/components/pages/categories/form-modal'
import { HelpCircle, PlusCircle, Trash } from 'lucide-react'
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

import { Input } from '@/components/ui/input'
import { AlertModal } from '@/components/modals/alert-modal'
import { BreadCrumb } from '@/components/breadCrumb'
import { Delete, create } from '@/hooks/queries'
import Link from 'next/link'

interface Props {
    initialData: EntitySchema | null
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
    const EditorRef = useRef<any>(null)
    const CodeEditorRef = useRef<any>(null)

    // Delete modal
    const [open, setOpen] = useState(false)
    const [editorChoice, setEditorChoice] = useState('text')
    const [categoryForm, showCategoryForm] = useState(false)

    const title = initialData ? `Edit ${name}` : `New ${name}`
    const toastMessage = initialData ? `${name} updated` : `${name} created`
    const action = initialData ? 'Save changes' : 'Create'

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
        data.description = EditorRef.current.getContent()
        postQuery.mutate(data)
    }

    useEffect(() => {
        if (initialData) {
            modal && form.reset(mapToForm(initialData))
        }
    }, [initialData])

    function showValue() {
        const value = CodeEditorRef.current.getValue()
        alert(value)
    }


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


            
            <div className={`${!modal ? 'mt-20' : ''} w-full justify-center`}>
                <div className="">
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
                                            Description
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
