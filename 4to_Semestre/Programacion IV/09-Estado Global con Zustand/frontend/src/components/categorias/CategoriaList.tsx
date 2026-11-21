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
import { Categoria } from "../../types/categoria"
import { TablePagination } from "../TablePagination"

interface CategoriaListProps {
  data: Categoria[]
  onEdit: (categoria: Categoria) => void
  onDelete: (id: number) => void
  isAdmin?: boolean
}

export function CategoriaList({ data, onEdit, onDelete, isAdmin = false }: CategoriaListProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<Categoria>[]>(() => {
    const baseCols: ColumnDef<Categoria>[] = [
      {
        accessorKey: "id",
        header: "ID",
        cell: (info) => <span className="font-mono text-xs">{info.getValue() as number}</span>,
      },
      {
        accessorKey: "nombre",
        header: "Nombre",
        cell: (info) => <span className="font-medium text-slate-900">{info.getValue() as string}</span>,
      },
      {
        accessorKey: "descripcion",
        header: "Descripcion",
        cell: (info) => <span className="text-slate-600">{(info.getValue() as string) || "-"}</span>,
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
              className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Esta seguro de eliminar esta categoria?")) {
                  onDelete(row.original.id)
                }
              }}
              className="px-2.5 py-1 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded transition"
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
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3 select-none">
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer flex items-center gap-1 hover:text-slate-800"
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
          <tbody className="divide-y divide-slate-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
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
