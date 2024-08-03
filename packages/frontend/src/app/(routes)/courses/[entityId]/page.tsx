import React from 'react'
import Repository from '@repetition/core/course/Repository'
import { getUserAuth } from "@repetition/frontend/lib/auth/utils";
import { CourseForm as Form } from '@/components/pages/courses/form'
import Overlay from "@/components/overlay";
import InlineSpinner from "@/components/spinners/InlineSpinner";
import { isError } from '@repetition/core/types';
import { entitySchema } from '@repetition/core/auth/Validators';
import { BreadCrumb } from '@/components/breadCrumb'
import { Heading } from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator';

const repository = new Repository()
const endpoint = 'courses'
const name = 'Course'


const Page = async ({ params }: { params: { entityId: string } }) => {
    const auth = await getUserAuth();

    if (!auth.session) {
        return null;
    }


    let courseId = "new"


    const entity = await repository.fetchByUuid(params.entityId)
    if (isError(entity)) {
        return <div>This page does not exist</div>
    }
    courseId = entity.uuid

    const breadCrumbLinks = [
        { 
            label: 'Courses',
            href: `/dashboard`
        },
        { 
            label: entity.name
        },
    ]


    if (entity.name) {
        breadCrumbLinks.push({
            label: 'Practice Items',
            href: `/${endpoint}/${params.entityId}/problems`,
        })
    }



    return (
        <div className="flex-col">
            <div className="flex-1 pt-6">
            <div className="flex flex-col px-8 justify-between">
                <div className="flex">

                    <div>
                        <Heading title={entity.name} />
                        <BreadCrumb
                            className="mt-2"
                            links={breadCrumbLinks}
                        />
                    </div>
                    <div className="ml-auto flex gap-2">
                    </div>
                </div>
            
            <Separator className="my-5" />

            </div>
        </div>

        <div className={`mt-20  w-full justify-center`}>
            <div className="max-w-[1000px] m-auto grid grid-cols-12 gap-8">
                <h1>{entity.name}</h1>
                <p>{entity.description}</p>
            </div>
        </div>
    </div>
)};

export default Page;
