import { useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { SortingState, ColumnSort } from '@tanstack/react-table'

const defaultSort = {desc: true, id: 'category'}
const useSort = (startingSort: ColumnSort = defaultSort) => {
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const router = useRouter()
    const createQueryString = useCallback(
        (params: {name:string, value:string}[]) => {
            const currentParams = new URLSearchParams(searchParams.toString())
            for (let p of params) {
                currentParams.set(p.name, p.value)
            }
            return currentParams.toString()
        },
        [searchParams]
    )

    let sorting = [startingSort]

    const sortBy = searchParams.get('sortby')
    const direction = searchParams.get('desc')
    
    if (sortBy) {
        sorting = [{
            id: sortBy,
            desc: direction === 'false' ? false : true
        }]
    }

    const setTheSort = ( a:any): void  =>  {
        let s: SortingState = a()
        let paramArray:any = []
        for (let sort of s) {
            for (let param in sort) {
                paramArray.push({
                    name: param === 'id' ? 'sortby' : param, 
                    value:sort[param as keyof typeof sort].toString() 
                })
            }
        }
        router.push(pathname + '?' + createQueryString(paramArray))
    }

    return {sorting, setTheSort}
}

export {useSort}