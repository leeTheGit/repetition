'use client'

import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'
import Link from 'next/link'

export type CategoryColumn = {
    uuid: string
    courseId: string
    courseSlug: string
    name: string
    createdAt: string
}

export const columns: ColumnDef<CategoryColumn>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        size: 40,
        cell: ({ row }) => {
            return (
                <Link
                    href={`/course/${row.original.courseSlug}/categories/${row.original.uuid}`}
                    className="text-base"
                >
                    {row.original.name}
                </Link>
            )
        },
    },
    {
        accessorKey: 'createdAt',
        header: 'Date',
    },
    {
        id: 'actions',
        cell: ({ row }) => <CellAction data={row.original} />,
    },
]
