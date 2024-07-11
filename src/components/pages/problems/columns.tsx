'use client'

import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'
import Link from 'next/link'
import { Submit } from './submit'
import {deltaToNow} from '@/lib/dates'


export type ProblemColumn = {
    uuid: string
    name: string
    slug: string
    lastSubmitted: string,
    status: number[]
    submissionCount: number
    difficulty: number
}

export const columns: ColumnDef<ProblemColumn>[] = [
    {
        accessorKey: 'name',
        header: () => <div className="text-left">Name</div>,
        cell: ({ row }) => {
            return (
                <Link
                    href={`/problems/${row.original.slug}`}
                    className="text-base hover:underline"
                >
                    {row.original.name}
                </Link>
            )
        },
    },
     {
        accessorKey: 'status',
        header: () => <div className="text-right">History</div>,
        cell: ({ row }) => {
            // Do not delete the below commented colors. required for 
            // tailwind to work with interpolated strings
            // bg-[#009722],
            // bg-[#e6b502],
            // bg-[#c90404],

            return (
                <div className="flex flex-row-reverse">
                    {row.original.status.map(s => {
                    
                        let color = "#009722"
                        if (s < 4) color = "#e6b502" 
                        if (s < 2) color = "#c90404" 
        
                        return <div className={`bg-[${color}] h-[15px] w-[15px] mr-1`}>
                            </div>
                    })}
                </div>
            )
        },

    },
    {
        id: "last_practiced",
        accessorKey: "lastSubmitted",
        header: () => <div className="text-center">Last practiced</div>,
        cell: ({ row }) => <div className="text-center">{deltaToNow(row.original.lastSubmitted)}</div>, 
        // cell: ({ row }) => <div className="text-center">{deltaToNow("2024-07-11T02:08:33")}</div>, 
        // cell: ({ row }) => <div className="text-center">{deltaToNow(new Date())}</div>, 
    },

    {
        accessorKey: 'submissionCount',
        header: () => <div className="text-center">Practice count</div>,
        cell: ({ row }) => <div className="text-center">{row.original.submissionCount}</div>, 
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
            return <Submit data={row.original} />
        }
    },
    // {
    //     id: 'actions',
    //     cell: ({ row }) => <CellAction data={row.original} />,
    // },
]
