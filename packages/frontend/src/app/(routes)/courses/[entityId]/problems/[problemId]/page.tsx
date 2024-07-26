import React from 'react'
import Repository from '@repetition/core/problems/Repository'
import CourseRepository from '@repetition/core/course/Repository'
import { getUserAuth } from "@repetition/frontend/lib/auth/utils";
import { ProblemForm as Form } from '@/components/pages/problems/form'
import CategoryRepository from '@repetition/core/category/Repository'
import Overlay from "@/components/overlay";
import InlineSpinner from "@/components/spinners/InlineSpinner";
import { isError } from '@repetition/core/types';

const repository = new Repository()
const courseRepository = new CourseRepository()
const categoryRepository = new CategoryRepository()

const Page = async ({ params }: { params: { entityId: string, problemId:string } }) => {
    const auth = await getUserAuth();

    if (!auth.session) {
        return null;
    }


    let courseId = undefined
    let isNew = false
    let entity = null

    if (params.problemId === 'new') {
        isNew = true
    }

    if (!isNew) {
        entity = await repository.fetchByUuid(params.problemId)
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


    let categories = await categoryRepository.fetchAll({
        courseId: courseId,
    })

    return (
        <div className="flex-col">
            <div className="flex-1 pt-6">
                <Form 
                    initialData={entity ? entity.toObject() : null} 
                    courseSlug={params.entityId}
                    courseId={courseId}
                    categories={categories.map(category => category.toObject())}
                />
            </div>
        </div>
    )};

export default Page;
