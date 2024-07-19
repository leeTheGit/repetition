import {Slugify} from '@/lib/utils'


const Categories = (course: string) => {
    return [
        {
            courseId: course,
            name: 'Arrays and Hashing',
            slug: Slugify('Arrays and Hashing'),
            isSeeded: true,
        },
        {
            courseId: course,
            name: 'Two Pointers',
            slug: Slugify('Two Pointers'),
            isSeeded: true,
        },
        {
            courseId: course,
            name: 'Sliding Window',
            slug: Slugify('Sliding Window'),
            isSeeded: true,
        },
        {
            courseId: course,
            name: 'Stack',
            slug: Slugify('Stack'),
            isSeeded: true,
        },
        {
            courseId: course,
            name: 'Binary Search',
            slug: Slugify('Binary Search'),
            isSeeded: true,
        },
        {
            courseId: course,
            name: 'Linked List',
            slug: Slugify('Linked List'),
            isSeeded: true,
        },
        {
            courseId: course,
            name: 'Trees',
            slug: Slugify('Trees'),
            isSeeded: true,
        },
        {
            courseId: course,
            name: 'Heap / Priority Queue',
            slug: Slugify('Heap / Priority Queue'),
            isSeeded: true,
        },
        {
            courseId: course,
            name: 'Graphs',
            slug: Slugify('Graphs'),
            isSeeded: true,
        },
    ]
}

export default Categories
