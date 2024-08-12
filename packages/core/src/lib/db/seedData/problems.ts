import {Slugify} from '@repetition/core/lib/utils'

import * as problems from './problemData.json'


console.log(problems)

// 'arrays-and-hashing': 'dc2238c7-9707-47ad-8b6f-9cf5ac150aec',
// 'two-pointers': 'a2d0b717-b31e-4bd8-b176-03f523def424',
// 'sliding-window': '61ad0945-e052-4e83-a431-ad8ea32ee788',
// stack: '07c1da35-c598-426c-83b5-a9d8453c7e51',
// 'binary-search': 'f4f292a4-5ed5-46d7-9822-a65ad04f5e69',
// 'linked-list': 'a2d8a036-aa40-471c-81cc-4501300e7220',
// trees: 'cdc9e085-102e-49d7-8132-b37b008d9eb8',
// 'heap-priority-queue': '0a072743-7081-45ec-a915-d448b370abdc',
// graphs: '8f5ef0cc-f17a-483c-ade6-c1bd395b6f24'
// submission: [
//     submitted_at: "2024-07-16 01:17:21.58",
//     grade: 5
// ]

type CatType = { [key: string]: string  }

const Problems = (categories: CatType, course: string) => {
    return [
        {
            name: "Two Sum",
            courseId: course,
            categoryUuid: categories['arrays-and-hashing'],
            slug: Slugify('Two Sum'),
            description: '',
            starterCode: "",
            difficulty: 1,
            link: '',
            submission: [
                {
                    submitted_at: "2024-07-16 01:36:56.928",
                    grade: 4,
                    solution: '',
                    note: '',
                }
            ]
        },
        {
            name: "Valid Anagram",
            courseId: course,
            categoryUuid: categories['arrays-and-hashing'],
            slug: Slugify('Valid Anagram'),
            description: '',
            starterCode: "",
            difficulty: 1,
            link: '',
            submission: [
                {
                    submitted_at: "2024-07-16 01:17:21.58",
                    grade: 5,
                    solution: '',
                    note: '',
                }
            ]
        },
        {
            name: "Contains Duplicate",
            courseId: course,
            categoryUuid: categories['arrays-and-hashing'],
            slug: Slugify('Contains Duplicate'),
            description: '',
            starterCode: "",
            difficulty: 1,
            link: '',
            submission: [
                {
                    submitted_at: "2024-07-16 01:36:40.135",
                    grade: 4,
                    solution: '',
                    note: '',
                }
            ]
        },
        {
            name: "Group Anagrams",
            courseId: course,
            categoryUuid: categories['arrays-and-hashing'],
            slug: Slugify('Group Anagrams'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
            submission: [
                {
                    submitted_at: "2024-07-14 01:22:45.184",
                    grade: 5,
                    solution: '',
                    note: '',
                }
            ]

        },
        {
            name: "Top K Frequent Elemements",
            courseId: course,
            categoryUuid: categories['arrays-and-hashing'],
            slug: Slugify('Top K Frequent Elemements'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
            submission: [
                {
                    submitted_at: "2024-07-14 01:16:08.765",
                    grade: 5,
                    solution: '',
                    note: '',
                }
            ]

        },
        {
            name: "Valid Soduoku",
            courseId: course,
            categoryUuid: categories['arrays-and-hashing'],
            slug: Slugify('Valid Soduoku'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        },
         {
            name: "Product of Array Except Self",
            courseId: course,
            categoryUuid: categories['arrays-and-hashing'],
            slug: Slugify('Product of Array Except Self'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
            submission: [
                {
                    submitted_at: "2024-07-16 03:41:25.025",
                    grade: 1,
                    solution: '',
                    note: '',
                },
                {
                    submitted_at: "2024-07-17 01:05:18.781",
                    grade: 5,
                    solution: '',
                    note: '',
                }

            ]


        },
        {
            name: "Longest Consecutive Sequence",
            courseId: course,
            categoryUuid: categories['arrays-and-hashing'],
            slug: Slugify('Longest Consecutive Sequence'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        },
        {
            name: "Valid Palindrome",
            courseId: course,
            categoryUuid: categories['two-pointers'],
            slug: Slugify('Valid Palindrome'),
            description: '',
            starterCode: "",
            difficulty: 1,
            link: '',
        },
        {
            name: "Two Sum II Input Array is Sorted",
            courseId: course,
            categoryUuid: categories['two-pointers'],
            slug: Slugify('Two Sum II Input Array is Sorted'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        },       
        {
            name: "3 Sum",
            courseId: course,
            categoryUuid: categories['two-pointers'],
            slug: Slugify('3 Sum'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        },       
        {
            name: "Container With Most Water",
            courseId: course,
            categoryUuid: categories['two-pointers'],
            slug: Slugify('Container With Most Water'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        },
        {
            name: "Best Time To Buy and Sell Stock",
            courseId: course,
            categoryUuid: categories['sliding-window'],
            slug: Slugify('Best Time To Buy and Sell Stock'),
            description: '',
            starterCode: "",
            difficulty: 1,
            link: '',
        },
        {
            name: "Logest Substring Without Repeating Characters",
            courseId: course,
            categoryUuid: categories['sliding-window'],
            slug: Slugify('Logest Substring Without Repeating Characters'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        },
        {
            name: "Longest Repeating Character Replacement",
            courseId: course,
            categoryUuid: categories['sliding-window'],
            slug: Slugify('Longest Repeating Character Replacement'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        },
        
        {
            name: "Valid Parentheses",
            courseId: course,
            categoryUuid: categories['stack'],
            slug: Slugify('Valid Parentheses'),
            description: '',
            starterCode: "",
            difficulty: 1,
            link: '',
        },
        {
            name: "Min Stack",
            courseId: course,
            categoryUuid: categories['stack'],
            slug: Slugify('Min Stack'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        },
        {
            name: "Daily Temperatures",
            courseId: course,
            categoryUuid: categories['stack'],
            slug: Slugify('Daily Temperatures'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        },

        {
            name: "Binary Search",
            courseId: course,
            categoryUuid: categories['binary-search'],
            slug: Slugify('Binary Search'),
            description: '',
            starterCode: "",
            difficulty: 1,
            link: '',
        },
        {
            name: "Find Minimum In Rotated Sorted Array",
            courseId: course,
            categoryUuid: categories['binary-search'],
            slug: Slugify('Find Minimum In Rotated Sorted Array'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        },
        {
            name: "Search In Rotated Sorted Array",
            courseId: course,
            categoryUuid: categories['binary-search'],
            slug: Slugify('Search In Rotated Sorted Array'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        },
        {
            name: "Reverse Linked List",
            courseId: course,
            categoryUuid: categories['linked-list'],
            slug: Slugify('Reverse Linked List'),
            description: '',
            starterCode: "",
            difficulty: 1,
            link: '',
            submission: [
                {
                    submitted_at: "2024-07-14 01:31:00.038",
                    grade: 5,
                    solution: '',
                    note: '',
                }
            ]

        },
        {
            name: "Merge Two Sorted Linked Lists",
            courseId: course,
            categoryUuid: categories['linked-list'],
            slug: Slugify('Merge Two Sorted Linked Lists'),
            description: '',
            starterCode: "",
            difficulty: 1,
            link: '',
        },
        {
            name: "Reorder List",
            courseId: course,
            categoryUuid: categories['linked-list'],
            slug: Slugify('Reorder List'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        },
        {
            name: "Remove Nth Node From End of List",
            courseId: course,
            categoryUuid: categories['linked-list'],
            slug: Slugify('Remove Nth Node From End of List'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        },
        {
            name: "Linked List Cycle",
            courseId: course,
            categoryUuid: categories['linked-list'],
            slug: Slugify('Linked List Cycle'),
            description: '',
            starterCode: "",
            difficulty: 1,
            link: '',
        },
        {
            name: "LRU Cache",
            courseId: course,
            categoryUuid: categories['linked-list'],
            slug: Slugify('LRU Cache'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        },

        {
            name: "Invert Binary Tree",
            courseId: course,
            categoryUuid: categories['trees'],
            slug: Slugify('Invert Binary Tree'),
            description: '',
            starterCode: "",
            difficulty: 1,
            link: '',
        },
        {
            name: "Maximum Depth of Binary tree",
            courseId: course,
            categoryUuid: categories['trees'],
            slug: Slugify('Maximum Depth of Binary tree'),
            description: '',
            starterCode: "",
            difficulty: 1,
            link: '',
        },

        {
            name: "Diameter of Binary Tree",
            courseId: course,
            categoryUuid: categories['trees'],
            slug: Slugify('Diameter of Binary Tree'),
            description: '',
            starterCode: "",
            difficulty: 1,
            link: '',
        },
        {
            name: "Balanced Binary Tree",
            courseId: course,
            categoryUuid: categories['trees'],
            slug: Slugify('Balanced Binary Tree'),
            description: '',
            starterCode: "",
            difficulty: 1,
            link: '',
        },
        {
            name: "Same Tree",
            courseId: course,
            categoryUuid: categories['trees'],
            slug: Slugify('Same Tree'),
            description: '',
            starterCode: "",
            difficulty: 1,
            link: '',
        },
        {
            name: "Subtree of Another Tree",
            courseId: course,
            categoryUuid: categories['trees'],
            slug: Slugify('Subtree of Another Tree'),
            description: '',
            starterCode: "",
            difficulty: 1,
            link: '',
        },
        {
            name: "Lowest Common Ancestor of a Binary Search Tree",
            courseId: course,
            categoryUuid: categories['trees'],
            slug: Slugify('Lowest Common Ancestor of a Binary Search Tree'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        }, 
        {
            name: "Binary Tree Level Order Traversal",
            courseId: course,
            categoryUuid: categories['trees'],
            slug: Slugify('Binary Tree Level Order Traversal'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        }, 
        {
            name: "Binary Tree Right Side View",
            courseId: course,
            categoryUuid: categories['trees'],
            slug: Slugify('Binary Tree Right Side View'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        }, 
        {
            name: "Count Good Nodes In Binary Tree",
            courseId: course,
            categoryUuid: categories['trees'],
            slug: Slugify('Count Good Nodes In Binary Tree'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        }, 
        {
            name: "Validate Binary Search Tree",
            courseId: course,
            categoryUuid: categories['trees'],
            slug: Slugify('Validate Binary Search Tree'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        }, 
        {
            name: "Kth Smallest Element In a BST",
            courseId: course,
            categoryUuid: categories['trees'],
            slug: Slugify('Kth Smallest Element In a BST'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        }, 
        
        {
            name: "Kth Largest Element In a Stream",
            courseId: course,
            categoryUuid: categories['heap-priority-queue'],
            slug: Slugify('Kth Largest Element In a Stream'),
            description: '',
            starterCode: "",
            difficulty: 1,
            link: '',
        }, 
        {
            name: "Last Stone Weight",
            courseId: course,
            categoryUuid: categories['heap-priority-queue'],
            slug: Slugify('Last Stone Weight'),
            description: '',
            starterCode: "",
            difficulty: 1,
            link: '',
        }, 
        {
            name: "Kth Largest Element in an Array",
            courseId: course,
            categoryUuid: categories['heap-priority-queue'],
            slug: Slugify('Kth Largest Element in an Array'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        },

        {
            name: "Number of Islands",
            courseId: course,
            categoryUuid: categories['graphs'],
            slug: Slugify('Number of Islands'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        },
        {
            name: "Max Area of Islands",
            courseId: course,
            categoryUuid: categories['graphs'],
            slug: Slugify('Max Area of Islands'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        },
        {
            name: "Clone Graph",
            courseId: course,
            categoryUuid: categories['graphs'],
            slug: Slugify('Clone Graph'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        },
        {
            name: "Pacific Atlantic Water Flow",
            courseId: course,
            categoryUuid: categories['graphs'],
            slug: Slugify('Pacific Atlantic Water Flow'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        },
        {
            name: "Surrounded Regions",
            courseId: course,
            categoryUuid: categories['graphs'],
            slug: Slugify('Surrounded Regions'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        },
        {
            name: "Course Schedule",
            courseId: course,
            categoryUuid: categories['graphs'],
            slug: Slugify('Course Schedule'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        },
        {
            name: "Course Schedule II",
            courseId: course,
            categoryUuid: categories['graphs'],
            slug: Slugify('Course Schedule II'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
        },
        {
            name: "Sum Values",
            courseId: course,
            categoryUuid: categories['linked-list'],
            slug: Slugify('Sum Values'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
            submission: [
                {
                    submitted_at: "2024-07-16 01:01:43.184",
                    grade: 5,
                    solution: '',
                    note: '',
                }
            ]

        },
        {
            name: "Get Value at Index",
            courseId: course,
            categoryUuid: categories['linked-list'],
            slug: Slugify('Get Value at Index'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
            submission: [
                {
                    submitted_at: "2024-07-14 07:16:04.119",
                    grade: 5,
                    solution: '',
                    note: '',
                }
            ]
        },
        {
            name: "Has Path",
            courseId: course,
            categoryUuid: categories['graphs'],
            slug: Slugify('Has Path'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
            submission: [
                {
                    submitted_at: "2024-07-17 01:28:29.898",
                    grade: 5,
                    solution: '',
                    note: '',
                }
            ]

        },
        {
            name: "Shortest Path",
            courseId: course,
            categoryUuid: categories['graphs'],
            slug: Slugify('Shortest Path'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',
            submission: [
                {
                    submitted_at: "2024-07-17 01:39:11.171",
                    grade: 5,
                    solution: '',
                    note: '',
                }
            ]

        },
        {
            name: "String Encode and Decode",
            courseId: course,
            categoryUuid: categories['arrays-and-hashing'],
            slug: Slugify('String Encode and Decode'),
            description: '',
            starterCode: "",
            difficulty: 2,
            link: '',

            
        },
    ]
}

export default Problems