"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

// import { priorities, statuses } from "./data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface Props<TData> {
    table: Table<TData>,
    searchKey?: string,
    filterColumns?: { 
        name: string, 
        data: () => { 
            value:string, 
            label:string,
            icon?: React.ComponentType<{className?: string | undefined}>
        }[]
    }[]
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  filterColumns
}: Props<TData>) {
    const isFiltered = table.getState().columnFilters?.length > 0

    
    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex flex-1 items-center space-x-2">
                {searchKey &&
                    <Input
                        placeholder="Filter ..."
                        value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                        onChange={(event) => {
                            table.getColumn(searchKey)?.setFilterValue(event.target.value)
                        }}
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                }



                { filterColumns?.map( (column) => {
                    if (table.getColumn(column.name)) {
                        return <DataTableFacetedFilter
                            key={column.name}
                            column={table.getColumn(column.name)}
                            title={column.name}
                            options={column.data()}
                        />
                    } 
                })}



                {isFiltered && (
                <Button
                    variant="ghost"
                    onClick={() => table.resetColumnFilters()}
                    className="h-8 px-2 lg:px-3"
                >
                    Reset
                    <Cross2Icon className="ml-2 h-4 w-4" />
                </Button>
                )}
            </div>
            <div className="ml-auto">
                <DataTableViewOptions table={table} />
            </div>
        </div>
    )
}
