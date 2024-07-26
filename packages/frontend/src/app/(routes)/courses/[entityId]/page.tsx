import React from 'react'
import Repository from '@repetition/core/course/Repository'
import { getUserAuth } from "@repetition/frontend/lib/auth/utils";
import { CourseForm as Form } from '@/components/pages/courses/form'
import Overlay from "@/components/overlay";
import InlineSpinner from "@/components/spinners/InlineSpinner";
import { isError } from '@repetition/core/types';

const repository = new Repository()

const Page = async ({ params }: { params: { entityId: string } }) => {
    const auth = await getUserAuth();

    if (!auth.session) {
        return null;
    }


    let courseId = "new"
    let isNew = false
    let entity = null

    if (params.entityId === 'new') {
        isNew = true
    }

    if (!isNew) {
        entity = await repository.fetchByUuid(params.entityId)
        if (isError(entity)) {
            return <div>This page does not exist</div>
        }
        courseId = entity.uuid
    }





    return (
        <div className="flex-col">
            <div className="flex-1 pt-6">
                <Form 
                    initialData={entity ? entity.toObject() : null} 
                    courseSlug={params.entityId}
                    courseId={courseId}
                />
            </div>
        </div>
    )};

export default Page;
