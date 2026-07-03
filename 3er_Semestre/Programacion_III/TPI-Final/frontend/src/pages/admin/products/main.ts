import { getCollection, saveCollection } from "../../../utils/db";
import { getUser, removeUser } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";
import { Rol } from "../../../types/Rol";

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutButton") as HTMLElement;

  logoutBtn.addEventListener("click", () => {
    removeUser();
    navigate("/src/pages/auth/login/index.html");
  });

  const currentUserStr = getUser();
  if (!currentUserStr) {
      navigate("/src/pages/auth/login/index.html");
      return;
  }
  const currentUser = JSON.parse(currentUserStr);
  if (currentUser.rol !== Rol.ADMIN && (currentUser as any).role !== "ADMIN") {
      navigate("/src/pages/store/home/index.html");
      return;
  }

  const tbody = document.querySelector("#data-table tbody") as HTMLElement;
  const btnNew = document.getElementById("btn-new") as HTMLButtonElement;
  const formContainer = document.getElementById("form-container") as HTMLElement;
  const crudForm = document.getElementById("crud-form") as HTMLFormElement;
  const btnCancel = document.getElementById("btn-cancel") as HTMLButtonElement;
  const formTitle = document.getElementById("form-title") as HTMLElement;
  const catSelect = document.getElementById("prod-categoria") as HTMLSelectElement;

  const loadCategories = () => {
      const categorias = getCollection<any>("categorias");
      catSelect.innerHTML = categorias.map(c => `<option value="${c.id}">${c.nombre}</option>`).join("");
  };
  loadCategories();

  const renderTable = () => {
      const productos = getCollection<any>("productos");
      let html = "";
      if (productos.length === 0) {
          html = `<tr><td colspan="8" style="text-align:center;">No hay productos.</td></tr>`;
      } else {
          productos.forEach(p => {
              html += `
                <tr class="animate-fade-in">
                    <td><img src="${p.imagen}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;"></td>
                    <td>${p.id}</td>
                    <td style="font-weight: 600;">${p.nombre}</td>
                    <td><span class="badge" style="background:#e1b12c; color:white;">${p.categoria?.nombre || 'General'}</span></td>
                    <td style="color:var(--color-primario); font-weight:bold;">$${p.precio.toLocaleString("es-AR")}</td>
                    <td>${p.stock}</td>
                    <td><span class="badge ${p.disponible ? 'ENTREGADO' : 'PENDIENTE'}">${p.disponible ? 'Activo' : 'Inactivo'}</span></td>
                    <td>
                        <button class="btn btn-secondary btn-edit" data-id="${p.id}" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;">Editar</button>
                        <button class="btn btn-remove btn-delete" data-id="${p.id}" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;">Eliminar</button>
                    </td>
                </tr>
              `;
          });
      }
      tbody.innerHTML = html;

      document.querySelectorAll(".btn-edit").forEach(btn => {
          btn.addEventListener("click", (e) => {
              const id = parseInt((e.currentTarget as HTMLElement).getAttribute("data-id") || "0");
              const prods = getCollection<any>("productos");
              const prod = prods.find(p => p.id === id);
              if (prod) {
                  (document.getElementById("prod-id") as HTMLInputElement).value = prod.id.toString();
                  (document.getElementById("prod-nombre") as HTMLInputElement).value = prod.nombre;
                  (document.getElementById("prod-precio") as HTMLInputElement).value = prod.precio.toString();
                  (document.getElementById("prod-desc") as HTMLTextAreaElement).value = prod.descripcion;
                  (document.getElementById("prod-stock") as HTMLInputElement).value = prod.stock.toString();
                  (document.getElementById("prod-imagen") as HTMLInputElement).value = prod.imagen;
                  catSelect.value = (prod.categoria?.id || prod.categoriaId).toString();
                  (document.getElementById("prod-disponible") as HTMLSelectElement).value = prod.disponible ? "true" : "false";
                  
                  formTitle.textContent = "Editar Producto";
                  formContainer.style.display = "block";
              }
          });
      });

      document.querySelectorAll(".btn-delete").forEach(btn => {
          btn.addEventListener("click", (e) => {
              if(confirm("¿Estás seguro de eliminar este producto?")) {
                  const id = parseInt((e.currentTarget as HTMLElement).getAttribute("data-id") || "0");
                  let prods = getCollection<any>("productos");
                  prods = prods.filter(p => p.id !== id);
                  saveCollection("productos", prods);
                  renderTable();
              }
          });
      });
  };

  btnNew.addEventListener("click", () => {
      crudForm.reset();
      (document.getElementById("prod-id") as HTMLInputElement).value = "";
      formTitle.textContent = "Nuevo Producto";
      formContainer.style.display = "block";
  });

  btnCancel.addEventListener("click", () => {
      formContainer.style.display = "none";
  });

  crudForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const idStr = (document.getElementById("prod-id") as HTMLInputElement).value;
      
      const categorias = getCollection<any>("categorias");
      const catId = parseInt(catSelect.value);
      const categoryObj = categorias.find(c => c.id === catId);

      const payload = {
          nombre: (document.getElementById("prod-nombre") as HTMLInputElement).value,
          precio: parseFloat((document.getElementById("prod-precio") as HTMLInputElement).value),
          descripcion: (document.getElementById("prod-desc") as HTMLTextAreaElement).value,
          stock: parseInt((document.getElementById("prod-stock") as HTMLInputElement).value),
          imagen: (document.getElementById("prod-imagen") as HTMLInputElement).value,
          disponible: (document.getElementById("prod-disponible") as HTMLSelectElement).value === "true",
          categoriaId: catId,
          categoria: categoryObj
      };

      let prods = getCollection<any>("productos");

      if (idStr) {

          const id = parseInt(idStr);
          const index = prods.findIndex(p => p.id === id);
          if (index > -1) {
              prods[index] = { ...prods[index], ...payload };
          }
      } else {

          const newId = prods.length ? Math.max(...prods.map(p => p.id)) + 1 : 1;
          prods.push({ id: newId, ...payload });
      }

      saveCollection("productos", prods);
      formContainer.style.display = "none";
      renderTable();
  });

  renderTable();
});
