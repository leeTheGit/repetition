"use client"

import { z } from 'zod'
import React, { useRef, useState } from "react"
import { Button } from '@/components/ui/button'
import { ProblemColumn } from "./columns";
// import { AlertModal } from "@/components/modals/alert-modal";
import Editor from '@monaco-editor/react'
import { Modal } from "@/components/modals/form-modal";
import {Submit} from "./submit"
import { useFetchQuery } from '@/hooks/use-query'
import { useQuery } from '@tanstack/react-query'
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from "@/components/ui/checkbox"
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { Delete, create } from '@/hooks/queries'
// import { toast } from 'sonner'
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import {handler} from '@repetition/functions/code-runner-ts'
interface Props {
    data: ProblemColumn;
} 

const endpoint = 'submission'
const name = 'Submission'
let vimSetting:any;


export const Practice = ({data}: Props) => {
    
    const CodeEditorRef = useRef<any>(null)
    const [submitModal, setSubmitModal] = useState(false)
    const [submissionId, setSubmissionId] = useState(undefined)
    const [vimMode, setVimMode] = useState(false)
    const [loading, setLoading] = useState(false)
    const queryClient = useQueryClient();
    const submitSchema = z.object({
        problemUuid:z.string().uuid(),
        grade: z.string(),
        note: z.string(),
    })

    type FormSchema = z.infer<typeof submitSchema>

    const form = useForm<FormSchema>({
        resolver: zodResolver(submitSchema),
        defaultValues: {
            problemUuid: data.uuid,
            grade: '',
            note: ''
        }
    })

    const get = async (submissionId?: string) => {
        if (!submissionId) {
            return false
        }

        const res:any = await fetch(`/api/code?submissionId=${submissionId}`, {
            method: 'GET',
        })
        if (!res.ok) {
            throw new Error(`Failed to get ${name}`)
        }

        const data = await res.json()
        return data
    }


    const poll = useQuery({
        queryKey: ['submission', submissionId],
        queryFn: () => get(submissionId),
        enabled: !!submissionId,
        retry: 10,
        retryDelay: 1000
    })


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




    const submitCode = async () => {
        setSubmissionId(undefined)

        const code = CodeEditorRef.current.getValue()

        // handler({
        //     id: '2adsfs',
        //     version: '2',
        //     account:'',
        //     time:"3e43",
        //     region: "ap-southeast-2",
        //     resources: [""],
        //     source: "",
        //     "detail-type": '',
        //     detail: {
        //         user_id: '5adfc196-3415-4251-b1d9-8c58ab8bb154',
        //         submission_id: '2332',
        //         user_code: code, 
        //         test_code: '; 6+7'
        //     }
        // }, {
        //     callbackWaitsForEmptyEventLoop: false,
        //     functionName: '',
        //     functionVersion: '',
        //     invokedFunctionArn:'',
        //     memoryLimitInMB: '',
        //     awsRequestId: '',
        //     logGroupName: '',
        //     logStreamName: '',
        //     getRemainingTimeInMillis: () => 2,
        //     done: () => {},
        //     fail: () => {},
        //     succeed: () => {}
        // })
        const req = await fetch('/api/code', {
            method: 'POST',
            body: JSON.stringify({
                problemId: data.uuid, 
                code
            })
        })

        const result = await req.json();
        setSubmissionId(result.data)
    }
    

    return (

        <>
            <Modal
                isOpen={submitModal}
                onClose={() => setSubmitModal(false)}
                className="max-w-[80%]  max-h-full min-h-[80%]"
                escapeKey={false}
            >
                <DialogHeader>
                    <DialogTitle className="text-4xl">{data.name}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-8">

                    <div className="col-span-1" >
                        <div className="problem-description" dangerouslySetInnerHTML={{ __html: data.description }}></div>

                        <Tabs className="w-full" defaultValue="test0">
                            <TabsList>
                            {poll.data?.data && poll.data.data.answers.map((answer:any, i:number) => {
                                const textColor = answer.pass === 'true' ? "text-green-400" : "text-red-500" 
                                const selColor = answer.pass === 'true' ? "data-[state=active]:text-green-400" : "data-[state=active]:text-red-500" 

                                return <TabsTrigger
                                    className={`data-[state=active]:bg-[#4b4b4b] ${selColor} ${textColor}`}
                                    value={`test${i}`}
                                >
                                    Test {i+1}
                                </TabsTrigger>
                            })}

                            </TabsList>

                            {poll.data?.data && poll.data.data.answers.map((answer: {pass:string, expected:number, recieved: number}, i:number) => {
                                return <TabsContent value={`test${i}`}>
                                    <div>
                                        <p className={`${answer.pass === 'true' ? "text-green-400" : "text-red-500"}`}>
                                            {answer.pass === 'true' ? "Success!" : "Fail"}
                                        </p>
                                        <p>We were looking for: {answer.expected}</p>
                                        <p>And your code produced: {answer.recieved}</p>
                                    </div>
                                </TabsContent>
                            })}

                        </Tabs>

                        <div className="mt-5">
                            <p className="text-lg ">Console</p>
                            <div className="bg-black p-2">
                            
                            {poll.data?.data && poll.data.data.logs.map((log: string) => {
                                const logItem = JSON.stringify(JSON.parse(log))
                                return <div className="text-sm  text-white px-2"> {}
                                    <pre>{logItem.substring(1, logItem.length-1)}</pre>
                                </div>
                            })}
                        </div>

                        </div>

                    </div>

                    <div className="mt-2 col-span-1">
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
                                data.starterCode || ''
                            }
                            onMount={(editor, monaco) => {
                                CodeEditorRef.current = editor
                                if (vimMode) handleEditorDidMount(editor)
                            }}
                            theme="vs-dark"
                            height="70vh"
                            // className="max-h-[500px]"
                            defaultLanguage="javascript"
                            defaultValue="// some comment"
                        />
                        <code className="status-node"></code>
                        <div className="mt-5 flex">
                            <Button type="button" onClick={submitCode}>Test code</Button>
                            <Submit className="ml-auto" data={data} />
                        </div>
                    </div>

                </div>

            </Modal>

            <Button onClick={() => setSubmitModal(true)}>Practice</Button>
            
        </>
    )
}