"use client"
import { z } from 'zod'
import React, { useState } from "react"
import { Button } from '@/components/ui/button'
import { ProblemColumn } from "./columns";
import { AlertModal } from "@/components/modals/alert-modal";
import { Modal } from "@/components/modals/form-modal";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Delete, create } from '@/hooks/queries'
import { toast } from 'sonner'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface Props {
    data: ProblemColumn;
} 

const endpoint = 'submission'
const name = 'Submission'

export const Submit = ({data}: Props) => {
    const [submitModal, setSubmitModal] = useState(false)
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

    const postQuery = useMutation({
        mutationFn: (data: FormSchema) => {

            return create<FormSchema>(
                data,
                'POST',
                `${endpoint}/`
            )
        },
        onSuccess: (response) => {
            toast("Submission accepted")
            queryClient.invalidateQueries({ queryKey: ['/courses/algorithms/problems'] })
        },
        onError: () => {
            toast.error(`${name} failed to save`)
        },
        onSettled: () => {
            form.reset()
            setSubmitModal(false)
        },
    })


    const onSubmit = (data: FormSchema) => {
        postQuery.mutate(data)
    }
    
    const answers = [
        'Pefect response',
        'Correct answer after some hesitation',
        'Correct answer recalled with serious difficulty',
        'Incorrect answer, but easily remembered upon review',
        'Incorrect answer, but remembered upon review',
        'Complete blackout',
    ];

    return (

        <>
            <Modal
                isOpen={submitModal}
                onClose={() => setSubmitModal(false)}
            >
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 w-full"
                    >
                        <h1>How did you go?</h1>
                        <FormField
                            control={form.control}
                            name="grade"
                            render={({ field }) => (
                                <FormItem className="col-span-3">
                                    <Select
                                        disabled={loading}
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
                                                    placeholder="How did you go?"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {answers.map((item, i) => {
                                                return (
                                                    <SelectItem
                                                        key={item}
                                                        value={((answers.length - 1) - i).toString()}
                                                    >
                                                        {item}
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            
                            )}
                            /> 

                            <FormField
                                control={form.control}
                                name="note"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="flex">
                                            Note to self...
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>

            </Modal>

            <Button onClick={() => setSubmitModal(true)}>Submit</Button>

        </>
    )
}