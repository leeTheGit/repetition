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
// import { ApiList } from '@/components/ui/api-list'
// import { FormModal } from '@/components/pages/billboards/form-modal'

import { useFetchQuery } from '@/hooks/use-query'
import { useDebounce } from '@/hooks/use-debounce'
import { ProblemAPI } from '@/core/problems/response/ProblemDTO'

// interface Props {
//     userId: string
// }

const endpoint = 'problems'

export const Listing = () => {
    const params = useParams()
    // delete modal
    const [open, setOpen] = useState(false)

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 20,
    })
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const entities = useFetchQuery<ProblemAPI[]>(
        endpoint,
        {
            pagination,
            columnFilters: useDebounce(columnFilters, 500),
            queryParams: {
                order: 'asc',
                withSubmissions: true,
            }
        }
    )

    const entityColumns =
        !entities.error &&
        entities.data?.data.map((entity: ProblemAPI) => {
            return {
                uuid: entity.uuid,
                name: entity.name,
                slug: entity.slug,
                status: entity.history,
                submissionCount: entity.submissionCount || 0,
                lastSubmitted: entity.lastSubmitted || '',
                difficulty: entity.difficulty,
            }
        })

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <Heading
                        title={`Problems ${entities?.data?.data.length ? `(${entities.data.data.length})` : ''}`}
                        description={`Solve ${endpoint}`}
                    />
                </div>

                <Button onClick={() => setOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>

            <Separator />

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
                                        : 'No billboards found'
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
