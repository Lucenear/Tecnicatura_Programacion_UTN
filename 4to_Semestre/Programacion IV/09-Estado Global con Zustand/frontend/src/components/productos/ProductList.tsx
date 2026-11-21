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
import { Producto } from "../../types/producto"
import { Categoria } from "../../types/categoria"
import { TablePagination } from "../TablePagination"

interface ProductListProps {
  data: Producto[]
  onEdit: (producto: Producto) => void
  onDelete: (id: number) => void
  isAdmin?: boolean
  categorias?: Categoria[]
}

export function ProductList({
  data,
  onEdit,
  onDelete,
  isAdmin = false,
  categorias = [],
}: ProductListProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<Producto>[]>(() => {
    const baseCols: ColumnDef<Producto>[] = [
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
        accessorKey: "categoria_id",
        header: "Categoria",
        cell: (info) => {
          const catId = info.getValue() as number | undefined | null
          if (!catId) return <span className="text-slate-400">-</span>
          const cat = categorias.find((c) => c.id === catId)
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
              {cat ? cat.nombre : `ID: ${catId}`}
            </span>
          )
        },
      },
      {
        accessorKey: "descripcion",
        header: "Descripcion",
        cell: (info) => <span className="text-slate-600">{(info.getValue() as string) || "-"}</span>,
      },
      {
        accessorKey: "precio_base",
        header: "Precio",
        cell: (info) => {
          const val = Number(info.getValue())
          return <span className="font-medium text-slate-900">${val.toFixed(2)}</span>
        },
      },
      {
        accessorKey: "disponible",
        header: "Estado",
        cell: (info) => {
          const disp = Boolean(info.getValue())
          return disp ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              Disponible
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
              No disponible
            </span>
          )
        },
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
                if (window.confirm("Esta seguro de eliminar este producto?")) {
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
  }, [onEdit, onDelete, isAdmin, categorias])

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
