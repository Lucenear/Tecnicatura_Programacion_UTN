export default function ProductsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          Modulo de Productos
        </h1>
        <p className="text-slate-600 leading-relaxed mb-4">
          Esta seccion esta destinada a la administracion del catalogo de productos.
        </p>
        <p className="text-slate-600 leading-relaxed">
          Las operaciones de creacion, consulta, modificacion y eliminacion de productos, asi como la asignacion de categorias, son gestionadas mediante la API y demostradas en el archivo de REST Client.
        </p>
      </div>
    </div>
  );
}
