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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import TinyEditor from '@/components/TinyEditor'

import { Input } from '@/components/ui/input'
import { AlertModal } from '@/components/modals/alert-modal'
import { BreadCrumb } from '@/components/breadCrumb'
import { Delete, create } from '@/hooks/queries'
import Link from 'next/link'
import { Practice } from './practice'
import {  ProblemAPI } from '@repetition/core/problems/response/ProblemDTO'

interface Props {
    initialData: ProblemAPI
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
let codeStash = {
    user: "",
    test: ""
}

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
            status: initialData?.status || 'draft',
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


    const onSubmit = async (data: FormSchema) => {
        data.description = EditorRef.current.getContent()
        if (CodeEditorRef.current) {
            data.starterCode = CodeEditorRef.current.getValue()
        } else {
            if (codeStash.user !== "") {
                data.starterCode = codeStash.user
            }
        }
        if (TestCodeEditorRef.current) {
            data.testCode = TestCodeEditorRef.current.getValue()
        } else {
            if (codeStash.test !== "") {
                data.testCode = codeStash.test
            }
        }

        postQuery.mutate(data)
    }

    const submitCode = async () => {
        const code = CodeEditorRef.current.getValue()
        const req = await fetch('/api/code', {
            method: 'POST',
            body: code
        })
        const result = await req.json();
    }

    

    // setup monaco-vim
    function handleEditorDidMount(editor:any) {
        //@ts-ignore
        window.require.config({
          paths: {
            "monaco-vim": "/assets/monaco-vim"
          }
        });
   
        window.require(["monaco-vim"], function (MonacoVim) {
            const statusNode = document.querySelector(".status-node");
            vimSetting = MonacoVim.initVimMode(editor, statusNode);
            vimSetting.constructor.Vim.map('jj', '<Esc>', 'insert')
        });
    }

    useEffect(() => {
        codeStash = {
            user: "",
            test: ""
        }
    }, [])


    const probs = {
        uuid: initialData.uuid,
        name: initialData.name,
        slug: initialData.slug,
        category: initialData.categoryUuid,
        description: initialData.description,
        starterCode: initialData.starterCode,
        link: initialData.link,
        grade: initialData.history || [],
        submissionCount: initialData.submissionCount || 0,
        lastSubmitted: initialData.lastSubmitted || '',
        difficulty: initialData.difficulty,
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
                                    href: `/courses`,

                                },
                                {
                                    label: courseSlug,
                                    href: `/courses/${courseSlug}`,
                                },
                                {
                                    label: 'Problems',
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


            
            <div className={` w-full justify-center`}>
                <div className="">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="pt-10"
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
                                />
                                <FormField
                                    control={form.control}
                                    name="link"
                                    render={({ field }) => (
                                        <FormItem className="col-span-5">
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
                            </div>

                            <div className="max-w-[1200px] m-auto mt-10 grid grid-cols-12 gap-5">
                                

                                <div className=" col-span-6">
                                    <h3 className="mb-3">Problem description</h3>

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

                                <Tabs className="w-full" defaultValue="user_code" onValueChange={(value) => {
                                    // When flipping between tabs we lose any code that has been changed
                                    // without being saved so we stash when switching then restsore.
                                    // Each editor has an onMount function used to place the text back.
                                    if (value === 'user_code') {
                                        codeStash.test = TestCodeEditorRef.current.getValue()
                                        TestCodeEditorRef.current = null
                                    }
                                    if (value === 'test_code') {
                                        codeStash.user = CodeEditorRef.current.getValue()
                                        CodeEditorRef.current = null
                                    }

                                }}>
                                    <TabsList>

                                        <TabsTrigger
                                            className={`data-[state=active]:bg-buttonactive data-[state=active]:text-white`}
                                            value={`user_code`}
                                        >
                                            User code
                                        </TabsTrigger>
                                        <TabsTrigger
                                            className={`data-[state=active]:bg-buttonactive data-[state=active]:text-white`}
                                            value={`test_code`}
                                        >
                                            Test code
                                        </TabsTrigger>

                                    </TabsList>

                                    <TabsContent value={`user_code`}>
                                        <div>
                                            <div className="flex items-center space-x-2 mb-2 w-full">
                                                <Checkbox 
                                                    className="ml-auto"
                                                    checked={vimMode}
                                                    onCheckedChange={() => {
                                                        setVimMode(!vimMode)
                                                        if (vimMode) {
                                                            vimSetting.dispose()
                                                        } else {
                                                            handleEditorDidMount(CodeEditorRef.current)
                                                        }
                                                    }
                                                }
                                                />
                                                <label
                                                    htmlFor="terms"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                   Vim mode 
                                                </label>
                                            </div>
                                            <Editor
                                                value={
                                                    // codeStash.user ||
                                                    form.formState
                                                        .defaultValues
                                                        ?.starterCode
                                                }
                                                onMount={(editor, monaco) => {
                                                    CodeEditorRef.current = editor
                                                    if (codeStash.user !== "") {
                                                        CodeEditorRef.current.setValue(codeStash.user)
                                                    }
                                                    if (vimMode) handleEditorDidMount(editor)
                                                }}
                                                theme="vs-dark"
                                                height="60vh"
                                                defaultLanguage="javascript"
                                                defaultValue=""
                                            />
                                            <code className="status-node"></code>
                                            <Button className="mt-4" type="button" onClick={submitCode}>Test code</Button>
                                        </div>
                                    </TabsContent>
                                    
                                    <TabsContent value={`test_code`}>
                                        <div className="">
                                            <Editor
                                                value={
                                                    form.formState
                                                        .defaultValues
                                                        ?.testCode || ''
                                                }
                                                onMount={(editor, monaco) => {
                                                    TestCodeEditorRef.current = editor
                                                    if (codeStash.test !== "") {
                                                        TestCodeEditorRef.current.setValue(codeStash.test)
                                                    }
                                                }}
                                                onChange={(editor, monaco) => {
                                                    // console.log(editor)
                                                    // console.log(monaco)
                                                }}
                                                theme="vs-dark"
                                                height="60vh"
                                                defaultLanguage="javascript"
                                                defaultValue="// some comment"
                                            />
                                        </div>

                                    </TabsContent>


                                </Tabs>


                                <div className="h-[200px]" id="testeditor"></div>
                                </div>
                            </div>

                            <div className="max-w-[1200px] m-auto  flex mt-10">
                                <Button className="" type="submit">
                                    {action}
                                </Button>
                                <Practice data={initialData} />
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    )
}
