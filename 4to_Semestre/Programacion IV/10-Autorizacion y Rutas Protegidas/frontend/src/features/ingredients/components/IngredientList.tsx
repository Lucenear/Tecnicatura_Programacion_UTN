import { useState, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table"
import { Ingredient } from "../types/ingredient"
import { TablePagination } from "@/shared/components/TablePagination"

interface IngredientListProps {
  data: Ingredient[]
  onEdit: (ingredient: Ingredient) => void
  onDelete: (id: number) => void
  isAdmin?: boolean
}

export function IngredientList({
  data,
  onEdit,
  onDelete,
  isAdmin = false,
}: IngredientListProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<Ingredient>[]>(() => {
    const baseCols: ColumnDef<Ingredient>[] = [
      {
        accessorKey: "id",
        header: "ID",
        cell: (info) => <span className="font-mono text-xs dark:text-slate-400">{info.getValue() as number}</span>,
      },
      {
        accessorKey: "nombre",
        header: "Nombre",
        cell: (info) => <span className="font-medium text-slate-900 dark:text-white">{info.getValue() as string}</span>,
      },
      {
        accessorKey: "costo",
        header: "Costo",
        cell: (info) => {
          const val = Number(info.getValue() || 0)
          return <span className="font-semibold text-slate-800 dark:text-slate-200">${val.toFixed(2)}</span>
        },
      },
      {
        accessorKey: "stock",
        header: "Stock",
        cell: (info) => <span className="text-slate-600 dark:text-slate-300">{info.getValue() as number}</span>,
      },
      {
        accessorKey: "unidad",
        header: "Unidad",
        cell: (info) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
            {(info.getValue() as string) || "u"}
          </span>
        ),
      },
    ]

    if (isAdmin) {
      baseCols.push({
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onEdit(row.original)}
              className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded transition"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Esta seguro de eliminar este ingrediente?")) {
                  onDelete(row.original.id)
                }
              }}
              className="px-2.5 py-1 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 dark:text-red-300 dark:bg-red-950/40 dark:hover:bg-red-900/50 rounded transition"
            >
              Eliminar
            </button>
          </div>
        ),
      })
    }

    return baseCols
  }, [onEdit, onDelete, isAdmin])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-900 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3 select-none">
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: " ▲",
                          desc: " ▼",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination table={table} />
    </div>
  )
}
