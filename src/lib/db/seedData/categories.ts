import {Slugify} from '@/lib/utils'


const Categories = () => {
    return [
        {
            name: 'Arrays and Hashing',
            slug: Slugify('Arrays and Hashing'),
            isSeeded: true,
        },
        {
            name: 'Two Pointers',
            slug: Slugify('Two Pointers'),
            isSeeded: true,
        },
        {
            name: 'Sliding Window',
            slug: Slugify('Sliding Window'),
            isSeeded: true,
        },
        {
            name: 'Stack',
            slug: Slugify('Stack'),
            isSeeded: true,
        },
        {
            name: 'Binary Search',
            slug: Slugify('Binary Search'),
            isSeeded: true,
        },
        {
            name: 'Linked List',
            slug: Slugify('Linked List'),
            isSeeded: true,
        },
        {
            name: 'Trees',
            slug: Slugify('Trees'),
            isSeeded: true,
        },
        {
            name: 'Heap / Priority Queue',
            slug: Slugify('Heap / Priority Queue'),
            isSeeded: true,
        },
        {
            name: 'Graphs',
            slug: Slugify('Graphs'),
            isSeeded: true,
        },
    ]
}

export default Categories
