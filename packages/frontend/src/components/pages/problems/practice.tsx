"use client"

import React, { useRef, useState } from "react"
import { Button } from '@/components/ui/button'
import { ProblemColumn } from "./columns";
import { PaginationState } from '@tanstack/react-table'
import Editor from '@monaco-editor/react'
import { Modal } from "@/components/modals/form-modal";
import {Submit} from "./submit"
import { useFetchQuery } from '@/hooks/use-query'
// import { useQuery } from '@tanstack/react-query'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from "@/components/ui/checkbox"
import Overlay from "@/components/overlay";
import InlineSpinner from "@/components/spinners/InlineSpinner";
import {handler} from '@repetition/functions/code-runner-ts'
import { SubmissionAPI } from '@repetition/core/submission/response/SubmissionDTO'
import { useLocalStorage} from '@/hooks/use-local-storage'



interface Props {
    data: ProblemColumn;
} 

const endpoint = 'submission'
const name = 'Submission'
let vimSetting:any;

const poll = {
    isFetching: false,
    data: {
        data: {
            answers:[],
            logs:[]
        }   
    }
}

export const Practice = ({data}: Props) => {
    const [token, setToken] = useLocalStorage("tokenName", "");
    const [localVimMode, setLocalVimMode] = useLocalStorage("vimMode", false) 
    const CodeEditorRef = useRef<any>(null)
    const [submitModal, setSubmitModal] = useState(false)
    const [submissionId, setSubmissionId] = useState(undefined)
    const [submitting, setSubmitting] = useState(false)
    // const [vimMode, setVimMode] = useState(false)
    // const [loading, setLoading] = useState(false)
    const [recieved, setRecieved]=  useState(false)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 40,
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

    const submissions = useFetchQuery<SubmissionAPI[]>(
        'submission',
        {
            pagination,
        }
    )
    // const poll = useQuery({
    //     queryKey: ['submission', submissionId],
    //     queryFn: () => get(submissionId),
    //     enabled: !!submissionId,
    //     retry: 10,
    //     retryDelay: 1000
    // })


    // setup monaco-vim
    function handleEditorDidMount(editor:any) {
        //@ts-expect-error
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
        setRecieved(false)

        let code = CodeEditorRef.current?.getValue()
        const req = await handler({
            id: 'localtest',
            version: '2',
            account:'',
            time:"3e43",
            region: "ap-southeast-2",
            resources: [""],
            source: "",
            "detail-type": '',
            detail: {
                user_id: '5adfc196-3415-4251-b1d9-8c58ab8bb154',
                submission_id: '2332',
                user_code: code, 
                test_code: data.testCode
            }
        }, {
            callbackWaitsForEmptyEventLoop: false,
            functionName: '',
            functionVersion: '',
            invokedFunctionArn:'',
            memoryLimitInMB: '',
            awsRequestId: '',
            logGroupName: '',
            logStreamName: '',
            getRemainingTimeInMillis: () => 2,
            done: () => {},
            fail: () => {},
            succeed: () => {}
        })
        if ("result" in req.body) {
            poll.data.data.answers = JSON.parse( req.body.result.answer )
            poll.data.data.logs = JSON.parse( req.body.result.logs )
        }
        setRecieved(true)
        

        // setSubmitting(true)
        // try {
        //     const req = await fetch('/api/code', {
        //         method: 'POST',
        //         body: JSON.stringify({
        //             problemId: data.uuid, 
        //             code
        //         })
        //     })
        //     if (!req.ok) {
        //         throw new Error(`Failed to submit code`)
        //     }
        //     const result = await req.json();
        //     setSubmissionId(result.data)
        //     setSubmitting(false) 
 
        // } catch(e) {
        //     console.log("Error: ", e)
        //     setSubmitting(false) 
        // }
    }

    return (

        <>
            <Modal
                isOpen={submitModal}
                onClose={() => setSubmitModal(false)}
                className="max-w-[80%]  max-h-full min-h-[80%] dark:bg-[#1e1e1e] "
                escapeKey={false}
            >
                <DialogHeader>
                    <DialogTitle className="text-4xl">{data.name}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-8">

                    <div className="col-span-1">

                        <Tabs className="mt-5 w-full" defaultValue="description" onValueChange={(value) => {
                            console.log(value)
                        }}>
                            <TabsList>
                                <TabsTrigger
                                    key="description"
                                    className={`data-[state=active]:bg-[#4b4b4b]`}
                                    value="description"
                                >
                                    Description
                                </TabsTrigger>
                                <TabsTrigger
                                    key="submissions"
                                    className={`data-[state=active]:bg-[#4b4b4b]`}
                                    value="submissions"
                                >
                                    Submissions
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent key="description" value="description">
                                <div className="overflow-scroll">
                                    <div className="mt-[25px] problem-description overflow-y-auto" dangerouslySetInnerHTML={{ __html: data.description }}>
                                        {/* Description editor */}
                                    </div>

                                    {data.starterCode &&     
                                        <Tabs className="mt-auto w-full" defaultValue="results">
                                            <TabsList>
                                                <TabsTrigger
                                                    key="results"
                                                    className={`data-[state=active]:bg-[#4b4b4b]`}
                                                    value="results"
                                                >
                                                    Results
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    key="console"
                                                    className={`data-[state=active]:bg-[#4b4b4b]`}
                                                    value="console"
                                                >
                                                    Console
                                                </TabsTrigger>
                                            </TabsList>

                                            <TabsContent key="results" value="results">
                                                
                                                <Tabs className="w-full" defaultValue="test0">
                                                    <TabsList>
                                                    {poll.data?.data && poll.data.data.answers.map((answer:any, i:number) => {
                                                        const textColor = answer.pass === 'true' ? "text-green-400" : "text-red-500" 
                                                        const selColor = answer.pass === 'true' ? "data-[state=active]:text-green-400" : "data-[state=active]:text-red-500" 

                                                        return <TabsTrigger
                                                            key={i}
                                                            className={`data-[state=active]:bg-[#4b4b4b] ${selColor} ${textColor}`}
                                                            value={`test${i}`}
                                                        >
                                                            Test {i+1}
                                                        </TabsTrigger>
                                                    })}

                                                    </TabsList>

                                                    {poll.data?.data && poll.data.data.answers.map((answer: {pass:string, expected:number, recieved: number}, i:number) => {
                                                        return <TabsContent key={i} value={`test${i}`}>
                                                            <div>
                                                                <p className={`${answer.pass === 'true' ? "text-green-400" : "text-red-500"}`}>
                                                                    {answer.pass === 'true' ? "Success!" : "Fail"}
                                                                </p>
                                                                <p>We were looking for: {JSON.stringify(answer.expected)}</p>
                                                                <p>And your code produced: {JSON.stringify(answer.recieved) || "nothing"}</p>
                                                            </div>
                                                        </TabsContent>
                                                    })}
                                                </Tabs> 
                                            </TabsContent>

                                            <TabsContent key="console" value="console">
                                                <div className="mt-5">
                                                    <div className="">
                                                    
                                                        {poll.data?.data && poll.data.data.logs.map((log: string, i:number) => {
                                                            const logItem = JSON.stringify(JSON.parse(log))
                                                            return <div key={i} className="text-sm  text-white px-2"> {}
                                                                <pre>{logItem.substring(1, logItem.length-1)}</pre>
                                                            </div>
                                                        })}
                                                    </div>
                                                </div>
                                            </TabsContent>

                                        </Tabs>
                                    }
                                </div>


                            </TabsContent>
                            <TabsContent key="submissions" value="submissions">
                            </TabsContent>
                        </Tabs>









                    </div>


                    {data.starterCode && 
                    <div className="col-span-1">
                        {(poll.isFetching || submitting) && 
                        <Overlay>
                            <InlineSpinner />
                        </Overlay>
                        }

                        <div className="flex items-center space-x-2 mb-2 w-full">
                            <Checkbox 
                                className="ml-auto"
                                checked={localVimMode}
                                onCheckedChange={() => {
                                    setLocalVimMode(!localVimMode)
                                    if (localVimMode) {
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
                                if (localVimMode) handleEditorDidMount(editor)
                            }}
                            theme="vs-dark"
                            height="70vh"
                            // className="max-h-[500px]"
                            defaultLanguage="javascript"
                            defaultValue="// some comment"
                        />
                        <code className="status-node"></code>
                        <div className="mt-5 flex">
                            <Button disabled={poll.isFetching || submitting} type="button" onClick={submitCode}>Test code</Button>
                            <Submit className="ml-auto" data={data} ref={CodeEditorRef} />
                        </div>
                    </div>
                }
                <Submit className="ml-auto" data={data} ref={CodeEditorRef} />
                </div>

            </Modal>

            <Button type="button" onClick={() => setSubmitModal(true)}>Practice</Button>
            
        </>
    )
}