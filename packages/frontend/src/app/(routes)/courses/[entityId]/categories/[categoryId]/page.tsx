import React from 'react'
import Repository from '@repetition/core/category/Repository'
import CourseRepository from '@repetition/core/course/Repository'
import { getUserAuth } from "@repetition/core/lib/auth/utils";
import { CategoryForm as Form } from '@/components/pages/categories/category-form'
import Overlay from "@/components/overlay";
import InlineSpinner from "@/components/spinners/InlineSpinner";
import { isError } from '@repetition/core/types';

const repository = new Repository()
const courseRepository = new CourseRepository()

const Page = async ({ params }: { params: { entityId: string, categoryId:string } }) => {
    const auth = await getUserAuth();

    if (!auth.session) {
        return null;
    }


    let courseId = undefined
    let isNew = false
    let entity = null

    if (params.categoryId === 'new') {
        isNew = true
    }

    if (!isNew) {
        entity = await repository.fetchByUuid(params.categoryId)
        if (isError(entity)) {
            return <div>This page does not exist</div>
        }
        courseId = entity.courseId
    }


    if (!courseId) {
        const course = await courseRepository.fetchByUuid(params.entityId)
        if (isError(course)) {
            return <div>This page does not exist</div>
        }
        courseId = course.uuid
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
