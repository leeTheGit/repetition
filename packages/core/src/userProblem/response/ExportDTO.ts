import { ProblemEntity } from '@repetition/core/problems/Entity'
import { WithoutNullableKeys } from '@repetition/core/types'

// {
//     name: "Two Sum",
//     courseId: course,
//     categoryUuid: categories['arrays-and-hashing'],
//     slug: Slugify('Two Sum'),
//     description: '',
//     starterCode: "",
//     difficulty: 1,
//     link: '',
//     submission: [
//         {
//             submitted_at: "2024-07-16 01:36:56.928",
//             grade: 4
//         }
//     ]
// },

export const ExportResponse = (res: ProblemEntity) => {
    return {
        id: res.id,
        uuid: res.uuid,
        name: res.name,
        courseId: res.courseId,
        categoryUuid: res.categoryUuid,
        categorySlug: res.categorySlug,
        slug: res.slug,
        description: res.description || '',
        starterCode: res.starterCode,
        difficulty: res.difficulty,
        answerCode: res.answerCode,
        testCode: res.testCode,
        link: res.link || '',
        submissions: res.history || [],
        type: res.type,
        lastSubmitted: res.lastSubmitted || '',
        category: res.categoryName || '',
        createdAt: res.createdAt,
    }
}


export type ProblemAPI = ReturnType<typeof ExportResponse>
export type ProblemAPIAPIForm = WithoutNullableKeys<
    ReturnType<typeof ExportResponse>
>
