import { logout } from "../../../utils/auth";
import { productos } from "../../../data/products";

const logoutBtn = document.getElementById("logoutButton") as HTMLElement;
const tablaProductos = document.getElementById("tabla-productos") as HTMLElement;
const formProducto = document.getElementById("form-producto") as HTMLFormElement;

logoutBtn.addEventListener("click", () => logout());

const cargarTabla = (): void => {
  tablaProductos.innerHTML = "";
  productos.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><img src="${p.imagen}" width="50"></td>
      <td>${p.nombre}</td>
      <td>${p.categoria}</td>
      <td>$${p.precio.toLocaleString("es-AR")}</td>
      <td>${p.stock}</td>
      <td><a href="#">Editar</a> | <a href="#">Eliminar</a></td>
    `;
    tablaProductos.appendChild(tr);
  });
};

formProducto.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  alert("Producto guardado (simulado)");
  formProducto.reset();
});

document.addEventListener("DOMContentLoaded", () => {
  cargarTabla();
});
