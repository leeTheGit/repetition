'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { EntitySchema as CategoryEntitySchema } from '@/core/category/Validators'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    EntitySchema,
    formSchema,
    apiInsertSchema,
    FormSchema,
} from '@/core/problems/Validators'
import Editor from '@monaco-editor/react'
import { FormModal } from '@/components/pages/categories/form-modal'
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

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
    categories: CategoryEntitySchema[]
}

const endpoint = 'problems'
const name = 'Problem'

export const ProblemForm: React.FC<Props> = ({
    initialData,
    categories,
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
        console.log(initialData)
        const data = {
            name: initialData?.name || '',
            categoryUuid: initialData?.categoryUuid || '',
            // courseId:initialData?.courseId || courseId, 
            courseSlug: initialData?.slug || courseSlug,
            description: initialData?.description || '',
            starterCode: initialData?.starterCode || '',
            answercode: initialData?.answerCode || '', 
            difficulty: initialData?.difficulty || 0, 
            status: initialData?.status || 'true',
        }
        return data
    }

    const form = useForm<FormSchema>({
        resolver: zodResolver(apiInsertSchema),
        defaultValues: mapToForm(initialData),
    })

    console.log("errors", form.formState.errors)
    // Create or update a category
    const postQuery = useMutation({
        mutationFn: (data: FormSchema) => {
            console.log(initialData)
            const method = initialData ? 'PATCH' : 'POST'
            const catId = initialData ? initialData.uuid : ''

            return create(data, method, `courses/${courseSlug}/${endpoint}/${catId}`)
        },
        onSuccess: (response) => {
            toast(toastMessage)
            if (!initialData && !modal) {
                router.push(`/course/${courseSlug}/${endpoint}/${response.data.slug}`)
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
        data.starterCode = CodeEditorRef.current.getValue()
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

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                message={`Are you sure you want to delete this ${name.toLowerCase()}?`}
                onConfirm={() =>
                    deleteQuery.mutate(
                        `courses/${courseId}/${endpoint}/${initialData?.uuid}`
                    )
                }
                loading={deleteQuery.isPending}
            />

            <FormModal
                isOpen={categoryForm}
                entityId={null}
                courseId={courseId}
                onClose={() => showCategoryForm(false)}
                onConfirm={() => {
                    showCategoryForm(false)
                }}
            />


            <div className="flex flex-col px-8 justify-between">
                <div className="flex">

                    <div>
                        <Heading title={title} />
                        {!modal && (
                            <BreadCrumb
                                className="mt-2"
                                links={[
                                    {
                                        label: 'Problems',
                                        href: `/${endpoint}`,
                                    },
                                    { label: initialData?.name || 'New' },
                                ]}
                            />
                        )}
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
                            className=" bg-gradient-to-t from-[#f1f5f9] dark:from-[#161f33] pt-10"
                        >
                            <div className="max-w-[1200px] m-auto grid grid-cols-12 gap-8">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="col-span-5">
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
                                    name="categoryUuid"
                                    render={({ field }) => (
                                        <FormItem className="col-span-3">
                                            <div className="flex items-center">
                                                <FormLabel className="flex items-center">
                                                    Category{' '}
                                                </FormLabel>
                                                <p className="ml-2 hover:cursor-pointer">
                                                    <PlusCircle
                                                        onClick={() =>
                                                            showCategoryForm(
                                                                true
                                                            )
                                                        }
                                                        height="15"
                                                        width="15"
                                                        className="text-gray-600 hover:text-gray-200"
                                                    />
                                                </p>
                                                <Link
                                                    target="_blank"
                                                    className="ml-auto text-xs hover:underline"
                                                    href={`/${courseId}/categories/${field.value}`}
                                                >
                                                    Edit
                                                </Link>
                                            </div>
                                            <Select
                                                // disabled={loading}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            defaultValue={
                                                                field.value
                                                            }
                                                            placeholder="Select a category"
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map(
                                                        (category) => (
                                                            <SelectItem
                                                                key={
                                                                    category.uuid
                                                                }
                                                                value={
                                                                    category.uuid
                                                                }
                                                            >
                                                                {category.name}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="difficulty"
                                    render={({ field }) => (
                                        <FormItem
                                            className={`${!modal ? 'col-span-3' : 'col-span-6'} `}
                                        >
                                            <FormLabel className="flex">
                                                Problem difficulty
                                                <Popover>
                                                    <PopoverTrigger>
                                                        <div className="ml-2 hover:cursor-pointer">
                                                            <HelpCircle
                                                                height="15"
                                                                width="15"
                                                                className="text-gray-600 hover:text-gray-200"
                                                            />
                                                        </div>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="bg-muted dark:bg-black p-3 text-xs">
                                                        A static page contains
                                                        html for content that
                                                        doesn&apos;t change
                                                        often i.e: an about
                                                        page, or legal pages.
                                                        Dynamic pages can
                                                        contain curated content
                                                        blocks and feeds from
                                                        collections.
                                                    </PopoverContent>
                                                </Popover>
                                            </FormLabel>

                                            <Select
                                                // disabled={loading}
                                                onValueChange={field.onChange}
                                                value={field.value.toString()}
                                                defaultValue={field.value.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            defaultValue={
                                                                field.value
                                                            }
                                                            placeholder="Select a difficulty type"
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {['Easy', 'Medium', 'Hard'].map(
                                                        (status, i) => (
                                                            <SelectItem
                                                                key={status}
                                                                value={(i+1).toString()}
                                                            >
                                                                {status}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col items-end justify-end col-span-1">
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

                            <div className="max-w-[1200px] m-auto mt-10 grid grid-cols-12 gap-2">
                                

                                <div className=" col-span-6">
                                    <TinyEditor
                                        reference={EditorRef}
                                        content={
                                            form.formState.defaultValues
                                                ?.description || ''
                                        }
                                    // changeHandler={(text) => formik.setFieldValue('marketing_content', text)}
                                />
                                </div>

                                <div className="mt-2 col-span-6">
                                    <Editor
                                        value={
                                            form.formState
                                                .defaultValues
                                                ?.starterCode || ''
                                        }
                                        onMount={(editor, monaco) =>
                                            (CodeEditorRef.current =
                                                editor)
                                        }
                                        theme="vs-dark"
                                        height="90vh"
                                        defaultLanguage="javascript"
                                        defaultValue="// some comment"
                                    />
                                </div>



                            </div>

                            <div className="max-w-[1200px] m-auto flex mt-10">
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
