'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { useCourseModal } from '@repetition/frontend/hooks/use-course-modal'

import { Modal } from '@repetition/frontend/components/ui/modal'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@repetition/frontend/components/ui/form'
import { Input } from '@repetition/frontend//components/ui/input'
import { Button } from '@repetition/frontend//components/ui/button'
import { toast } from 'sonner'
// import { redirect } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1),
})

export const CourseModal = () => {
    const courseModal = useCourseModal()

    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        try {
            const saveCourse = await fetch('/api/courses', {
                method: 'POST',
                body: JSON.stringify(values),
            })
            const response = await saveCourse.json()

            window.location.assign(`/courses/${response.data.slug}/edit`)
        } catch (error) {
            toast.error('There was an error saving your course')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            title="Create new course"
            description="Add a new private course"
            isOpen={courseModal.isOpen}
            onClose={courseModal.onClose}
        >
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="pt-6 space-x-2 flex items-center justify-end">
                                <Button
                                    variant="outline"
                                    onClick={courseModal.onClose}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">Continue</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}
