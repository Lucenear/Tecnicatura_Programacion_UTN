const cargarCategorias = () => {
    const contenedorCategorias = document.getElementById("lista-categorias");
    
    contenedorCategorias.innerHTML = "";

    categorias.forEach(categoria => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#">${categoria}</a>`;
        contenedorCategorias.appendChild(li);
    });
};

const cargarProductos = () => {
    const contenedorProductos = document.getElementById("contenedor-productos");
    
    contenedorProductos.innerHTML = "";

    productos.forEach(producto => {
        const article = document.createElement("article");
        article.classList.add("producto-card");

        article.innerHTML = `
            <h3>${producto.nombre}</h3>
            <img src="${producto.imagen}" alt="${producto.nombre}" width="250">
            <p>${producto.descripcion}</p>
            <p class="precio">Precio: <strong>$${producto.precio.toLocaleString('es-AR')}</strong></p>
            <button type="button" class="btn-detalles">Ver Detalles</button>
            <button type="button" class="btn-agregar" onclick="alert('Has agregado: ${producto.nombre}')">Agregar al Carrito</button>
        `;

        contenedorProductos.appendChild(article);
    });
};

document.addEventListener("DOMContentLoaded", () => {
    cargarCategorias();
    cargarProductos();
});
