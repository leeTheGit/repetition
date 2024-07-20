'use client'

import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'
import Link from 'next/link'

export type ProblemColumn = {
    uuid: string
    name: string
    description: string
    slug: string
}


export const columns: ColumnDef<ProblemColumn>[] = [
    {
        accessorKey: 'name',
        header: () => <div className="text-left">Name</div>,
        cell: ({ row }) => {
            return (
                <Link
                    href={`/courses/${row.original.slug}`}
                    className="text-base hover:underline"
                >
                    {row.original.name}
                </Link>
            )
        },
    },
    {
        accessorKey: 'description',
        header: () => <div className="text-left">Description</div>,
        cell: ({ row }) => {
            return <p>{row.original.description}</p>
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />,
    },
];

