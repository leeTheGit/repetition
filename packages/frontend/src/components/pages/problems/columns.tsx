'use client'

import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'
import Link from 'next/link'
import { Submit } from './submit'
import { Practice } from './practice'
import {deltaToNow} from '@repetition/core/lib/dates'
// import {deltaToNow} from '../../../../../core/src/lib/dates'
import { ArrowUpDown, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type ProblemColumn = {
    uuid: string
    name: string
    slug: string
    lastSubmitted: string
    link: string
    description: string
    category: string
    grade: {grade:number}[]
    submissionCount: number
    starterCode: string | null
    testCode: string
    difficulty: number
}


export const columns = (courseId: string) => {
    const columns: ColumnDef<ProblemColumn>[] = [
        {
            accessorKey: 'name',
            header: () => <div className="text-left">Name</div>,
            cell: ({ row }) => {
                return (
                    <div className="flex">
                        <Link
                            data-testid="problem-name"
                            href={`/courses/${courseId}/problems/${row.original.slug}`}
                            className="text-base hover:underline"
                        >
                            {row.original.name}
                        </Link>
                        {row.original.link && <Link
                            href={row.original.link || ""}
                            target="_blank"
                            className="text-sm text-elcyenlink hover:underline ml-2"
                        >
                            <LinkIcon />
                            {/* {row.original.link} */}
                        </Link>}
                    </div>
                )
            },
        },
        {
            accessorKey: 'category',
            header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() => {
                        column.toggleSorting(column.getIsSorted() === "asc")}
                    }
                  >
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                )
            },
            cell: ({ row }) => <div className="text-left">{row.original.category}</div>, 
        },
    
        {
            accessorKey: 'grade',
            header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() => {
                        column.toggleSorting(column.getIsSorted() === "asc")}
                    }
                  >
                    Grade
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                )
            },
            cell: ({ row }) => {
                // Do not delete the below commented colors. required for 
                // tailwind to work with interpolated strings
                // bg-[#009722],
                // bg-[#e6b502],
                // bg-[#c90404],
    
                return (
                    <div className="flex flex-row-reverse">
    
                        {row.original.grade.map((s, i) => {
                        
                            let color = "#009722"
                            if (s.grade < 4) color = "#e6b502" 
                            if (s.grade < 2) color = "#c90404" 
            
                            return <div key={i} className={`bg-[${color}] h-[15px] w-[15px] mr-1 shadow-[0_35px_60px_-15px_rgb(255, 255, 255)]`}>
                                </div>
                        })}
                    </div>
                )
            },
    
        },
        {
            id: "last_practiced",
            accessorKey: "lastSubmitted",
            header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() => {
                        column.toggleSorting(column.getIsSorted() === "asc")}
                    }
                  >
                    Last practiced
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                )
            },
            cell: ({ row }) => <div className="text-center">{deltaToNow(row.original.lastSubmitted)}</div>, 
            // cell: ({ row }) => <div className="text-center">{deltaToNow("2024-07-11T02:08:33")}</div>, 
            // cell: ({ row }) => <div className="text-center">{deltaToNow(new Date())}</div>, 
        },
    
        {
            accessorKey: 'submissionCount',
            header: () => <div className="text-center">Practice count</div>,
            cell: ({ row }) => <div className="text-center">{row.original.submissionCount || ''}</div>, 
        },
        {
            accessorKey: 'difficulty',
            header: () => <div className="text-center">Difficulty</div>,
            cell: ({ row }) => {
                let color = "bg-problemeasy"
    
                if (row.original.difficulty === 2) {
                    color = "bg-problemmedium"
                }
                if (row.original.difficulty === 3) {
                    color = "bg-problemhard"
                }
     
                return (
                    <div
                        className={`w-full h-[25px] ${color}`}
                    >
                    </div>
                )
            },
    
        },
        {
            id: 'submit',
            cell: ({row}) => {
                // return <Submit data={row.original} />
                return <Practice data={row.original} />
            }
        },
        // {
        //     id: 'actions',
        //     cell: ({ row }) => <CellAction data={row.original} />,
        // },
    ];

    return columns
}
