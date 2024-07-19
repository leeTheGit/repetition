'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { ColumnFiltersState, PaginationState } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { columns } from './columns'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FormModal } from '@/components/pages/categories/form-modal'

import { useFetchQuery } from '@/hooks/use-query'
import { useDebounce } from '@/hooks/use-debounce'

//TODO remove this type
export type Category = {
    uuid: string
    courseId: string
    name: string
    slug: string
    createdAt: string
}

interface Props {
    courseId: string
    courseSlug:string
}

const endpoint = 'categories'

export const Listing = ({ courseId, courseSlug }: Props) => {
    const params = useParams()
    // delete modal
    const [open, setOpen] = useState(false)

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const entities = useFetchQuery<Category[]>(
        endpoint,
        {
            pagination,
            columnFilters: useDebounce(columnFilters, 500),
        }
    )

    const entityColumns =
        !entities.error &&
        entities.data?.data.map((entity: Category) => {
            return {
                uuid: entity.uuid,
                courseId: courseId,
                courseSlug: courseSlug,
                name: entity.name,
                createdAt: new Date(entity.createdAt).toLocaleString(),
            }
        })

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <Heading
                        title={`Categories ${entities?.data?.data.length ? `(${entities.data.data.length})` : ''}`}
                        description={`Everything fits somewhere. Create categories to organise your content.`}
                    />
                </div>

                <Button onClick={() => setOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>

            <Separator />
            {/* To create a category we'll open the form in a modal */}
            {/* This form can also be opened from the tables' Cell Action to update*/}
            <FormModal
                isOpen={open}
                entityId={null}
                courseSlug={courseSlug}
                courseId={courseId}
                onClose={() => setOpen(false)}
                onConfirm={() => setOpen(false)}
            />

            <div className="w-full justify-center">
                <div className="flex m-auto max-w-[1200px]">
                    {entities.error && (
                        <p>PC Load Letter. Request failed :(</p>
                    )}

                    <DataTable
                        columns={columns}
                        columnFilters={columnFilters}
                        emptyMessage={
                            entities.isPending
                                ? 'Loading...'
                                : 'No categories found'
                        }
                        setColumnFilters={setColumnFilters}
                        data={entityColumns || []}
                        searchKey="name"
                        pagination={pagination}
                        setPagination={setPagination}
                        // filterColumns={[{
                        //     name: "billboard",
                        //     data: () => categoryOptions ? categoryOptions : []
                        // }]}
                    />
                </div>
            </div>
        </>
    )
}
