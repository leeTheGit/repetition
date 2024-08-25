'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { EntitySchema as CategoryEntitySchema } from '@repetition/core/category/Validators'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    EntitySchema,
    formSchema,
    apiInsertSchema,
    FormSchema,
} from '@repetition/core/problems/Validators'
import Editor from '@monaco-editor/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'



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
import { CommaSeparatedInput } from '@/components/form/comma-seperated-input'

import { Checkbox } from "@/components/ui/checkbox"

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
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Switch } from '@/components/ui/switch'
// import { Textarea } from '@/components/ui/textarea'
import TinyEditor from '@/components/TinyEditor'
import { CodeEditor } from '@/components/pages/problems/code-editor'
import { Input } from '@/components/ui/input'
import { AlertModal } from '@/components/modals/alert-modal'
import { BreadCrumb } from '@/components/breadCrumb'
import { Delete, create } from '@/hooks/queries'
import Link from 'next/link'
import { Practice } from './practice'
import {  ProblemAPI } from '@repetition/core/problems/response/ProblemDTO'
import { Textarea } from '@/components/ui/textarea'
import TagsList from '@/components/form/tags-list'

interface Props {
    initialData: ProblemAPI | null
    courseSlug: string
    courseId: string
    // courseId: string
    onClose?: () => void
    modal?: boolean
    categories: CategoryEntitySchema[]
}

const endpoint = 'problems'
const name = 'Problem'
let vimSetting:any;

// When saving we grab the code from each editor instance.
// As each editor is in a tab, it may not be mounted.
// We use the codeStash variable to store unsaved changes
// let codeStash = {
//     user: "",
//     test: ""
// }


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
    const TestCodeEditorRef = useRef<any>(null)
    const codeStash = useRef({user:"", test:""})

    // Delete modal
    const [open, setOpen] = useState(false)
    const [editorChoice, setEditorChoice] = useState('text')
    const [categoryForm, showCategoryForm] = useState(false)
    const [vimMode, setVimMode] = useState(false)

    const title = initialData ? `Edit ${name}` : `New ${name}`
    const toastMessage = initialData ? `${name} updated` : `${name} created`
    const action = initialData ? 'Save changes' : 'Create'

    const mapToForm = (initialData: ProblemAPI | null) => {
        const data = {
            name: initialData?.name || '',
            categoryUuid: initialData?.categoryUuid || '',
            submissionCount: initialData?.submissionCount || 0,

            // courseId:initialData?.courseId || courseId, 
            courseSlug: initialData?.slug || courseSlug,
            description: initialData?.description || '',
            starterCode: initialData?.starterCode || '',
            testCode: initialData?.testCode || '',
            answercode: initialData?.answerCode || '', 
            difficulty: initialData?.difficulty || 0, 
            link: initialData?.link || '', 
            type: initialData?.type || 'basic',
            status: initialData?.status || 'draft',
            tags: initialData?.tags || ''
        }
        return data
    }

    const form = useForm<FormSchema & {tags: string}>({
        resolver: zodResolver(apiInsertSchema),
        defaultValues: mapToForm(initialData),
    })
    const cardType = form.watch('type')

    // Create or update a category
    const postQuery = useMutation({
        mutationFn: (data: FormSchema) => {
            const method = initialData ? 'PATCH' : 'POST'
            const catId = initialData ? initialData.uuid : ''

            return create(data, method, `courses/${courseSlug}/${endpoint}/${catId}`)
        },
        onSuccess: (response) => {
            toast(toastMessage)
            if (!initialData && !modal) {
                router.push(`/courses/${courseSlug}/${endpoint}/${response.data.slug}`)
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
                router.push(`/courses/${courseSlug}/${endpoint}`)
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

    const deleteTag = (tag: string) => {
        console.log('deleting', tag)
        const allTagString = form.getValues("tags")
        console.log(allTagString, "all tags strinbg")
        const all = allTagString.split(',')
        console.log("all", all)
        let allTags = all.filter((t:string) => t !== tag)
        console.log("alltagsio", allTags)
        console.log("allTags", allTags)
        let tagString = allTags.join(',')
        console.log(tagString, " after delete")
        form.setValue('tags', tagString)
    }

    const onSubmit = async (data: FormSchema) => {
        if (EditorRef.current) {
            data.description = EditorRef.current.getContent()
        }
        if (cardType === 'code') {
            if (CodeEditorRef.current) {
                data.starterCode = CodeEditorRef.current.getValue()
            } else {
                if (codeStash.current.user !== "") {
                    data.starterCode = codeStash.current.user
                }
            }
            if (TestCodeEditorRef.current) {
                data.testCode = TestCodeEditorRef.current.getValue()
            } else {
                if (codeStash.current.test !== "") {
                    data.testCode = codeStash.current.test
                }
            }
        }

        postQuery.mutate(data)
    }

    // check if description is using basic text or rich text
    const defaultText = form.formState.defaultValues?.description[0] === "<" ? "rich_text" : "basic" 


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
                courseSlug={courseSlug}
                onClose={() => showCategoryForm(false)}
                onConfirm={() => {
                    showCategoryForm(false)
                }}
            />


            <div className="flex flex-col px-8 justify-between">
                <div className="flex">

                    <div>
                        <Heading title={title} />
                        <BreadCrumb
                            className="mt-2"
                            links={[
                                {
                                    label: 'Courses',
                                    href: `/dashboard`,

                                },
                                {
                                    label: courseSlug,
                                    href: `/courses/${courseSlug}`,
                                },
                                {
                                    label: 'Practice Items',
                                    href: `/courses/${courseSlug}/${endpoint}`,
                                },
                                { label: initialData?.name || 'New' },
                            ]}
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


            
            <div className={`pb-28 w-full justify-center`}>
                <div className="">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="pt-10"
                        >
                            <div 
                                className="max-w-[1200px] m-auto grid grid-cols-12 gap-8">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="col-span-6">
                                            <FormLabel className="flex">
                                                Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} autoFocus />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem className="col-span-3">
                                            <div className="flex items-center">
                                                <FormLabel className="flex items-center">
                                                    Type{' '}
                                                </FormLabel>
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
                                                        Create different card types to better
                                                        suite
                                                    </PopoverContent>
                                                </Popover>
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
                                                            placeholder="Select a card type"
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {['basic', 'code', 'multi-choice', 'written-answer', 'math'].map(
                                                        (type) => (
                                                            <SelectItem
                                                                key={
                                                                    type
                                                                }
                                                                value={
                                                                   type 
                                                                }
                                                            >
                                                                {type}
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
                                    name="link"
                                    render={({ field }) => (
                                        <FormItem className="col-span-6">
                                            <FormLabel className="flex">
                                                Link
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
                                    name="difficulty"
                                    render={({ field }) => (
                                        <FormItem
                                            className={`${!modal ? 'col-span-3' : 'col-span-6'} `}
                                        >
                                            <FormLabel className="flex">
                                                Problem difficulty
 
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
                                {/* <FormField
                                    control={form.control}
                                    name="status"
                                    
                                    render={({ field }) => {
                                        return <FormItem className="flex flex-col items-end justify-end col-span-1">
                                            <FormLabel>Active</FormLabel>
                                            <div className="h-10 flex items-center">
                                                <Switch
                                                    checked={!!field.value }
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    }}
                                /> */}
                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => { 
                                        const onBlur = (text: string) => {
                                            let mergedTags = field.value ? field.value.split(',') : []
                                            let current = text.split(',')

                                            mergedTags.push.apply(mergedTags, current)
                                            mergedTags = mergedTags.map((c:string) => c.trim().toLowerCase())
                                            let tagSet = new Set(mergedTags)
                                            let tagValues = tagSet.values()
                                            let tags = []
                                            for (let i =0; i < tagSet.size; i++) {
                                                tags.push(tagValues.next().value);
                                            }
                                            form.setValue('tags', tags.join(','))
                                            return true
                                        }
                                        return (
                                            <FormItem className="col-span-3">
                                                <FormLabel className="flex">
                                                    Tags
                                                </FormLabel>
                                                <FormControl>
                                                    <CommaSeparatedInput {...field} onBlur2={onBlur} />
                                                </FormControl>
                                                {field.value && 
                                                <TagsList 
                                                    tags={field.value.split(',')} 
                                                    handleDelete={(tag) => deleteTag(tag)}
                                                    />
                                                }
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                                
                            </div>



                            <div className="max-w-[1200px] m-auto mt-10 grid grid-cols-12 gap-10">
                                

                                <div className="flex flex-col col-span-6">
                                    <h3 className="mb-3 ">Question</h3>
                                    <div className="flex flex-col grow bg-slate-800 p-2">
                                    <Tabs className="flex flex-col grow w-full" defaultValue={defaultText} >
                                        <TabsList className="bg-transparent">
                                            <TabsTrigger
                                                className={`data-[state=active]:bg-buttonactive data-[state=active]:text-white`}
                                                value={`basic`}
                                            >
                                                Basic text
                                            </TabsTrigger>
                                            <TabsTrigger
                                                className={`data-[state=active]:bg-buttonactive data-[state=active]:text-white`}
                                                value={`rich_text`}
                                            >
                                                Rich text
                                            </TabsTrigger>

                                        </TabsList>

                                        <TabsContent className=" grow" value={`rich_text`}>
                                            <TinyEditor
                                                reference={EditorRef}
                                                content={
                                                    form.formState.defaultValues
                                                        ?.description || ''
                                                }
                                            // changeHandler={(text) => formik.setFieldValue('marketing_content', text)}
                                            />
                                        </TabsContent>
                                        <TabsContent className=" grow" value={`basic`}>
                                            <FormField
                                                control={form.control}
                                                name="description"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col h-full grow col-span-6">
                                                        {/* <FormLabel className="flex">
                                                            Answer
                                                        </FormLabel> */}
                                                        <FormControl>
                                                            <Textarea className="grow" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            /> 
                                        </TabsContent>
                                    </Tabs>
                                    </div>
                                </div>

                                <div className="col-span-6">
                                    <h3 className="mb-3 ">Answer</h3>
                                    <div className="flex flex-col grow bg-slate-800 p-2">

                                    {/* CodeEditorRef
                                    TestCodeEditorRef */}
                                    {cardType === 'code' &&
                                        <CodeEditor 
                                        ref={{
                                                //@ts-expect-error
                                                CodeEditorRef,
                                                TestCodeEditorRef,
                                                codeStash
                                            }} 
                                            
                                            form={form}
                                        />
                                    }

                                    {cardType === 'basic' &&
                                        <FormField
                                            control={form.control}
                                            name="answer"
                                            render={({ field }) => (
                                                <FormItem className="mt-[60px] col-span-6">
                                                    <FormControl>
                                                        <Textarea className="min-h-[300px]" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                   
                                    }
                                    </div>
                                </div>
                            </div>

                            <div className="max-w-[1200px] m-auto  flex mt-10">
                                <Button className="" type="submit">
                                    {action}
                                </Button>

                                {initialData && 
                                    <div className="ml-auto">
                                        <Practice data={initialData} buttonLabel="Preview card" />
                                    </div>
                                }
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    )
}
