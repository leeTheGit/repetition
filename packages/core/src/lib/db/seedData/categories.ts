import {Slugify} from '@repetition/core/lib/utils'

import * as problems from './problemData.json'

const Categories = (course: string) => {
    let categories = []
    let added = new Set()
    for (let problem of problems) {
        if (added.has(problem.category)) continue
        added.add(problem.category)
        categories.push({
            courseId: course,
            name: problem.category,
            slug: Slugify(problem.category),
            isSeeded: true
        })
    }

    return categories

}

export default Categories
