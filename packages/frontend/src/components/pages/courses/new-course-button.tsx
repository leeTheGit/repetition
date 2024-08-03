'use client'

import { Button } from "@/components/ui/button";
import { useCourseModal } from '@/hooks/use-course-modal'
import { Plus } from "lucide-react";


export const NewCourse = () => {
    const courseModal = useCourseModal()

    return (
        <Button onClick={() => courseModal.onOpen()}>
            <Plus className="mr-2 h-4 w-4" />
            Create Course
        </Button>

    )

}