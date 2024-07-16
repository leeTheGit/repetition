import React from 'react'
import Repository from '@/core/problems/Repository'
import { getUserAuth } from "@/lib/auth/utils";
import { ProblemForm as Form } from '@/components/pages/problems/form'

import Overlay from "@/components/overlay";
import InlineSpinner from "@/components/spinners/InlineSpinner";
import { isError } from '@/core/types';

const repository = new Repository()

const Page = async ({ params }: { params: { entityId: string, problemId:string } }) => {
    const auth = await getUserAuth();

    if (!auth.session) {
        return null;
    }



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
    }

    return (
        <div className="flex-col">
            <div className="flex-1 pt-6">
                <Form initialData={entity ? entity.toObject() : null} courseId={params.entityId} />
            </div>
        </div>
    )};

export default Page;
