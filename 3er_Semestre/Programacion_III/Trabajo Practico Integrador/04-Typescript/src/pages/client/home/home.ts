import { logout } from "../../../utils/auth";
import { productos, categorias } from "../../../data/products";

const logoutBtn = document.getElementById("logoutButton") as HTMLElement;
const listaCategorias = document.getElementById("lista-categorias") as HTMLUListElement;
const contenedorProductos = document.getElementById("contenedor-productos") as HTMLElement;
const formBusqueda = document.getElementById("form-busqueda") as HTMLFormElement;
const inputBusqueda = document.getElementById("input-busqueda") as HTMLInputElement;

logoutBtn.addEventListener("click", () => logout());

const cargarCategorias = (): void => {
  listaCategorias.innerHTML = "";
  categorias.forEach((categoria) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="#">${categoria}</a>`;
    listaCategorias.appendChild(li);
  });
};

const cargarProductos = (filtro: string = ""): void => {
  contenedorProductos.innerHTML = "";
  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  filtrados.forEach((p) => {
    const card = document.createElement("article");
    card.className = "producto-card";
    card.innerHTML = `
      <h3>${p.nombre}</h3>
      <img src="${p.imagen}" alt="${p.nombre}">
      <p>${p.descripcion}</p>
      <div class="footer-card">
        <p class="precio"><strong>$${p.precio.toLocaleString("es-AR")}</strong></p>
        <div class="acciones-card">
          <button class="btn-detalles">Ver Detalles</button>
          <button class="btn-agregar">Agregar al Carrito</button>
        </div>
      </div>
    `;
    contenedorProductos.appendChild(card);
  });
};

formBusqueda.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  cargarProductos(inputBusqueda.value);
});

document.addEventListener("DOMContentLoaded", () => {
  cargarCategorias();
  cargarProductos();
});
