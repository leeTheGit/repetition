'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ColumnFiltersState, PaginationState,  } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { columns } from './columns'
// import { DataTableToolbar } from '@/components/ui/data-table-internal-toolbar'
// import { DataTableFacetedFilter } from '@/components/ui/data-table-faceted-filter'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'
import { ItemListing } from '@/components/pages/problems/problem-item'
import { useFetchQuery } from '@/hooks/use-query'
import { useDebounce } from '@/hooks/use-debounce'
import { ProblemAPI } from '@repetition/core/problems/response/ProblemDTO'
import { BreadCrumb } from '@/components/breadCrumb'
import { useSort } from '@/hooks/use-sort-table'
import { useFileDownloader } from '@/hooks/use-filedownloader'

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
    const endpoint = `courses/${courseId}/problems`
    const download = useFileDownloader()

    const router = useRouter()
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 20,
    })
    
    const {sorting, setTheSort} = useSort({desc: true, id: 'last_practiced'})
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
                description: entity.description,
                starterCode: entity.starterCode,
                testCode: entity.testCode,
                link: entity.link,
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

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const plug = await fetch('/api/courses/b84bbb71-6e38-491d-91f2-61c464dd9c63')
    //     }
        
    // })

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <Heading
                        title={`Practice ${entities?.data?.data.length ? `(${entities.data.data.length})` : ''}`}
                    />
                    <BreadCrumb
                        className="mt-2"
                        links={[
                            {
                                label: 'Courses',
                                href: `/dashboard`,
                            },
                            {
                                label: courseId,
                                href: `/courses/${courseId}`,
                            },
                            {
                                label: 'Practice Items',
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
                <div className="flex m-auto max-w-[1200px]" data-testid="problem-list">

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
                                setSorting={setTheSort}
                                exportFunc={() => download(`/api/courses/${courseId}/problems/export?withSubmissions=true`)}
                                filterColumns={[{
                                    name: "category",
                                    data: () => categoryOptions ? categoryOptions : []
                                }]}
                                childElement={<ItemListing courseId={courseId} />}
                            />
                </div>
            </div>
        </>
    )
}
