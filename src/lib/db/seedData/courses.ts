import {Slugify} from '@/lib/utils'

const Courses = (categories: { [key: string]: string }, course: string) => {
    return [
        {
            name: "Algorithms and Data Structures",
            slug: Slugify('Algorithms and Data Structures'),
            description: 'Study algorithms and data structures',
        },
        {
            name: "Cajun Cooking",
            slug: Slugify('Cajun Cooking'),
            description: 'Study recipes from West Africa, France and Spain',
        },
        {
            name: "Music scales using Guitar",
            slug: Slugify('Music scales using Guitar'),
            description: 'Practice scales on guitar',
        },

    ]
}

export default Courses