'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import { DataTableToolbar } from '@/components/ui/data-table-internal-toolbar'
import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'
// import { ApiList } from '@/components/ui/api-list'
// import { FormModal } from '@/components/pages/billboards/form-modal'

import { useFetchQuery } from '@/hooks/use-query'
import { useDebounce } from '@/hooks/use-debounce'
import { ProblemAPI } from '@/core/problems/response/ProblemDTO'
import { BreadCrumb } from '@/components/breadCrumb'

// interface Props {
//     userId: string
// }
export type Category = {
    uuid: string
    name: string
    slug: string
    createdAt: string
}

interface Props {
    courseId: string
}



export const Listing = ({courseId} : Props) => {
    const endpoint = `/courses/${courseId}/problems`
    // delete modal

    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [sorting, setSorting] = useState<SortingState>([{desc:true, id:'category'}])
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 20,
    })
    
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const categories = useFetchQuery<Category[]>('categories', )

    const entities = useFetchQuery<ProblemAPI[]>(
        endpoint,
        {
            pagination,
            columnFilters: useDebounce(columnFilters, 500),
            queryParams: {
                sortColumn: sorting[0].id,
                order: sorting[0].desc === true ? "desc" : "asc",
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
                category: entity.category,
                grade: entity.history || [],
                submissionCount: entity.submissionCount || 0,
                lastSubmitted: entity.lastSubmitted || '',
                difficulty: entity.difficulty,
            }
        })
   
    const categoryOptions = categories.data?.data.map((category) => {
        return {
            value: category.uuid,
            label: category.name,
        }
    })

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <Heading
                        title={`Problems ${entities?.data?.data.length ? `(${entities.data.data.length})` : ''}`}
                    />
                    <BreadCrumb
                        className="mt-2"
                        links={[
                            {
                                label: 'Courses',
                                href: `/courses`,
                            },
                            {
                                label: courseId,
                                href: `/courses/${courseId}`,
                            },
                            {
                                label: 'Problems',
                                href: `${endpoint}`,
                            },
                            // { label: initialData?.name || 'New' },
                        ]}
                    />

                </div>

                <Button 
                    onClick={() => router.push(`${endpoint}/new`)}
                >
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
                                columns={columns(courseId)}
                                columnFilters={columnFilters}
                                emptyMessage={
                                    entities.isPending
                                        ? 'Loading...'
                                        : 'No questions found'
                                }
                                setColumnFilters={setColumnFilters}
                                data={entityColumns || []}
                                searchKey="name"
                                pagination={pagination}
                                setPagination={setPagination}
                                sorting={sorting}
                                setSorting={setSorting}
                                filterColumns={[{
                                    name: "category",
                                    data: () => categoryOptions ? categoryOptions : []
                                }]}
                            />
                </div>
            </div>
        </>
    )
}
