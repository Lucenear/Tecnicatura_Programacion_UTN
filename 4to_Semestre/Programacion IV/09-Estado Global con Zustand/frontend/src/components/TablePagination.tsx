import { Table } from "@tanstack/react-table"

interface TablePaginationProps<T> {
  table: Table<T>
}

export function TablePagination<T>({ table }: TablePaginationProps<T>) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200 sm:px-6">
      <div className="text-sm text-slate-700">
        Pagina <span className="font-semibold">{table.getState().pagination.pageIndex + 1}</span> de{" "}
        <span className="font-semibold">{table.getPageCount() || 1}</span>
      </div>
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
