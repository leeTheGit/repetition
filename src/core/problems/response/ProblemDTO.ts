import { ProblemEntity } from '@/core/problems/Entity'
import { WithoutNullableKeys } from '@/core/types'



export const fetchResponse = (res: ProblemEntity) => {
    return {
        id: res.id,
        uuid: res.uuid,
        name: res.name,
        slug: res.slug,
        difficulty: res.difficulty,
        starterCode: res.starterCode,
        answerCode: res.answerCode,
        status: res.status,
        history: res.history || [],
        submissionCount: res.submissionCount || null,
        lastSubmitted: res.lastSubmitted || '',
        description: res.description || '',
        category: res.categoryName || '',
        createdAt: res.createdAt,
    }
}


export type ProblemAPI = ReturnType<typeof fetchResponse>
export type ProblemAPIAPIForm = WithoutNullableKeys<
    ReturnType<typeof fetchResponse>
>