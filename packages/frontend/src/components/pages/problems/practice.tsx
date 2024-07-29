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
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import {handler} from '@repetition/functions/code-runner-ts'
interface Props {
    data: ProblemColumn;
} 

const endpoint = 'submission'
const name = 'Submission'

export const Practice = ({data}: Props) => {
    
    const CodeEditorRef = useRef<any>(null)
    const [submitModal, setSubmitModal] = useState(false)
    const [submissionId, setSubmissionId] = useState(undefined)

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
        console.log('trying to code fetch', submissionId)
        if (!submissionId) {
            console.log('returning from code fetch')
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

    console.log("the data", poll.data)
    console.log("the data", poll.data?.data)

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
            body: code
        })
        const result = await req.json();
        setSubmissionId(result.data)
    }
    
    const pino = {
        one: 'two',
        finke: 4
    }

    return (

        <>
            <Modal
                isOpen={submitModal}
                onClose={() => setSubmitModal(false)}
                className="max-w-[80%] overflow-auto max-h-full min-h-[80%]"
            >
                <DialogHeader>
                    <DialogTitle className="text-4xl">{data.name}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-8">

                    <div className="col-span-1" >
                        <div className="problem-description" dangerouslySetInnerHTML={{ __html: data.description }}></div>
                        <div className="mt-4 bg-slate-200 p-5">
                            {poll.data?.data && poll.data.data.answers.map((answer: {pass:string, expected:number, recieved: number}, i:number) => {
                                return <div>
                                    <h3>Test {i+1}</h3>
                                    <p className={`${answer.pass === 'true' ? "text-green-400" : "text-red-500"}`}>
                                        {answer.pass === 'true' ? "Success!" : "Fail"}
                                    </p>
                                    <p>We were looking for: {answer.expected}</p>
                                    <p>And your code produced: {answer.recieved}</p>
                                </div>
                            })}
                        </div>
                        <div>
                            <p>logs</p>
                            {/* {poll.data?.data && 
                                <div>
                                    <p><pre>{JSON.stringify(poll.data.data.logs, null, 2)}</pre></p>
                                </div>
                            } */}
                            {poll.data?.data && poll.data.data.logs.map((log: string) => {
                                return <div>
                                    <pre>{JSON.stringify(JSON.parse(log),null, 2)}</pre>
                                </div>
                            })}
                        </div>

                    </div>

                    <div className="mt-2 col-span-1">
                        <Editor
                            value={
                                data.starterCode || ''
                            }
                            onMount={(editor, monaco) =>
                                (CodeEditorRef.current =
                                    editor)
                            }
                            theme="vs-dark"
                            height="70vh"
                            // className="max-h-[500px]"
                            defaultLanguage="javascript"
                            defaultValue="// some comment"
                        />
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