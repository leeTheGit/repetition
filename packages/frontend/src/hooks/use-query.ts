import { useQuery } from '@tanstack/react-query'

type Options = {
    enabled?: boolean
    pagination?: { pageIndex: number; pageSize: number }
    columnFilters?: { id: string; value: unknown }[]
    queryParams?: { [key: string]: unknown }
    queryKey?: any[]
}

export const useFetchQuery = <T>(
    resource: string,

    {
        enabled = true,
        pagination,
        columnFilters,
        queryParams = {},
        queryKey = [],
    }: Options = {}
) => {
    async function get(): Promise<{ success: string; data: T }> {
        const filters = []
        if (columnFilters && columnFilters.length > 0) {
            filters.push(
                columnFilters
                    .map((filter) => `${filter.id}=${filter.value}`)
                    .join('&')
            )
        }
        if (pagination) {
            if (pagination.pageIndex > 0) {
                filters.push(`offset=${pagination.pageIndex * pagination.pageSize}`)
            }
            filters.push(`limit=${pagination.pageSize}`)
        }
        for (const [key, value] of Object.entries(queryParams)) {
            if (!value) continue;
            filters.push(`${key}=${value}`)
        }

        let filterString = '?' + filters.join('&')

        const res = await fetch(`/api/${resource}${filterString}`)
        if (!res.ok) {
            throw new Error(`Failed to get ${resource}`)
        }

        const data = await res.json()
        return data
    }
    let qKey = [resource, pagination, columnFilters, queryParams]
    if (queryKey.length > 0) {
        qKey = queryKey
    }
    
    return useQuery<{ data: T }>({
        queryKey: qKey,
        queryFn: () => get(),
        enabled,
        
    })
}
