'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

import {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    flexRender,
    ExpandedState,
    getCoreRowModel,
    getFilteredRowModel,
    getExpandedRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
    getFacetedRowModel,
    getFacetedUniqueValues,
} from '@tanstack/react-table'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { DataTableToolbar } from '@/components/ui/data-table-internal-toolbar'
import React from 'react'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    emptyMessage?: string
    searchKey: string
    toolbar?: boolean
    columnFilters?: ColumnFiltersState
    setColumnFilters?: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
    pagination?: { pageIndex: number; pageSize: number }
    setPagination?: React.Dispatch<
        React.SetStateAction<{ pageIndex: number; pageSize: number }>
    >
    sorting?: {desc:boolean, id: string}[]
    setSorting?: React.Dispatch<
        React.SetStateAction<{ desc:boolean, id:string}[]>
    >
    childElement?: React.ReactElement
    isPaginated?: boolean
    filterColumns?: {
        name: string
        data: () => {
            value: string
            label: string
            icon?: React.ComponentType<{ className?: string | undefined }>
        }[]
    }[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
    emptyMessage = 'No results',
    searchKey,
    filterColumns,
    childElement,
    columnFilters,
    setColumnFilters,
    pagination = { pageIndex: 0, pageSize: 10 },
    setPagination,
    sorting = [{desc:true, id:'category'}],
    setSorting,
    isPaginated = true,
    toolbar = true,
}: DataTableProps<TData, TValue>) {
    const [columnFiltersInternal, setColumnFiltersInternal] =
        useState<ColumnFiltersState>([])
    const [expanded, setExpanded] = React.useState<ExpandedState>({})

    const table = useReactTable({
        data,
        columns,
        onColumnFiltersChange: setColumnFilters || setColumnFiltersInternal,
        onPaginationChange: setPagination,
        onSortingChange:setSorting,
        pageCount: -1,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        // getSortedRowModel: getSortedRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(), // manualFiltering belows negates this
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        onExpandedChange: setExpanded,

        manualFiltering: !!columnFilters || false, //turn off built-in client-side filtering
        manualPagination: true, //turn off built-in client-side pagination
        manualSorting: true, //turn off built-in client-side sorting

        state: {
            columnFilters: columnFilters || columnFiltersInternal,
            pagination,
            expanded,
            sorting
        },
    })

    // rows that are archived can be styled differently
    let containsArchiveColumn = false
    let rows: any = []
    const rowModels = table.getRowModel()
    if (rowModels.rows.length) {
        rows = rowModels.rows
    }
    dance: for (const row of rows) {
        for (const cell in row.original) {
            if (cell === 'isArchived') {
                containsArchiveColumn = true
                break dance
            }
        }
        break
    }

    return (
        <div className="w-full">
            {toolbar && (
                <div className="flex items-center py-4">
                    <DataTableToolbar
                        table={table}
                        searchKey={searchKey}
                        filterColumns={filterColumns}
                    />
                </div>
            )}

            <div className="rounded-md border">
                <Table className="dark:bg-elcyentable">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                className="dark:bg-black bg-[#f1f5f9]"
                                key={headerGroup.id}
                            >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            className="font-normal"
                                            key={header.id}
                                            colSpan={header.colSpan}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => {
                                const selectedClass = row.getIsSelected()
                                    ? 'bg-[#f1f5f9]'
                                    : ''
                                return (
                                    <React.Fragment key={row.id}>
                                        <TableRow
                                            key={row.id}
                                            data-state={
                                                row.getIsSelected() &&
                                                'selected'
                                            }
                                            className={
                                                containsArchiveColumn &&
                                                //@ts-ignore
                                                row.original.isArchived === true
                                                    ? `opacity-50 blur-[.7px] hover:blur-none`
                                                    : `${selectedClass}`
                                            }
                                            onClick={(e) => {
                                                if (
                                                    //@ts-ignore
                                                    e.target.tagName.toLowerCase() ===
                                                    'td'
                                                ) {
                                                    row.toggleExpanded()
                                                }
                                            }}
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell className="py-2" key={cell.id}>
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>

                                        {childElement &&
                                            row.getIsExpanded() && (
                                                <TableRow className="">
                                                    <TableCell
                                                        colSpan={columns.length}
                                                    >
                                                        {childElement &&
                                                            React.cloneElement(
                                                                childElement,
                                                                {
                                                                    //@ts-ignore
                                                                    orderUuid: row.original.uuid,
                                                                }
                                                            )}
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                    </React.Fragment>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {isPaginated && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    )
}
