import {Slugify} from '@repetition/core/lib/utils'

import * as problems from './problemData.json'


type CatType = { [key: string]: string  }

const Problems = (categories: CatType, course: string) => {

    const problemArr = []


    for (let prob of problems) {
        problemArr.push({
            name: prob.name,
            courseId: course,
            categoryUuid: categories[prob.categorySlug],
            slug: Slugify(prob.name),
            description: prob.description,
            starterCode: prob.starterCode,
            testCode: prob.testCode,
            difficulty: prob.difficulty,
            link: prob.link,
            type: prob.type,
            submission: prob.submissions.map(sub => {
                return {
                    submitted_at: sub.submittedAt,
                    grade: sub.grade,
                    solution: sub.solution || "",
                    note: sub.note || "",
                }
            })
        })
    }

    return problemArr

}

export default Problems