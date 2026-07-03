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

  const renderTable = () => {
      const categorias = getCollection<any>("categorias");
      let html = "";
      if (categorias.length === 0) {
          html = `<tr><td colspan="4" style="text-align:center;">No hay categorías.</td></tr>`;
      } else {
          categorias.forEach(c => {
              html += `
                <tr class="animate-fade-in">
                    <td>${c.id}</td>
                    <td style="font-weight: 600;">${c.nombre}</td>
                    <td>${c.descripcion}</td>
                    <td>
                        <button class="btn btn-secondary btn-edit" data-id="${c.id}" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;">Editar</button>
                        <button class="btn btn-remove btn-delete" data-id="${c.id}" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;">Eliminar</button>
                    </td>
                </tr>
              `;
          });
      }
      tbody.innerHTML = html;

      document.querySelectorAll(".btn-edit").forEach(btn => {
          btn.addEventListener("click", (e) => {
              const id = parseInt((e.currentTarget as HTMLElement).getAttribute("data-id") || "0");
              const cats = getCollection<any>("categorias");
              const cat = cats.find(c => c.id === id);
              if (cat) {
                  (document.getElementById("cat-id") as HTMLInputElement).value = cat.id.toString();
                  (document.getElementById("cat-nombre") as HTMLInputElement).value = cat.nombre;
                  (document.getElementById("cat-desc") as HTMLInputElement).value = cat.descripcion;
                  formTitle.textContent = "Editar Categoría";
                  formContainer.style.display = "block";
              }
          });
      });

      document.querySelectorAll(".btn-delete").forEach(btn => {
          btn.addEventListener("click", (e) => {
              if(confirm("¿Estás seguro de eliminar esta categoría?")) {
                  const id = parseInt((e.currentTarget as HTMLElement).getAttribute("data-id") || "0");
                  let cats = getCollection<any>("categorias");
                  cats = cats.filter(c => c.id !== id);
                  saveCollection("categorias", cats);
                  renderTable();
              }
          });
      });
  };

  btnNew.addEventListener("click", () => {
      crudForm.reset();
      (document.getElementById("cat-id") as HTMLInputElement).value = "";
      formTitle.textContent = "Nueva Categoría";
      formContainer.style.display = "block";
  });

  btnCancel.addEventListener("click", () => {
      formContainer.style.display = "none";
  });

  crudForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const idStr = (document.getElementById("cat-id") as HTMLInputElement).value;
      const nombre = (document.getElementById("cat-nombre") as HTMLInputElement).value;
      const desc = (document.getElementById("cat-desc") as HTMLInputElement).value;

      let cats = getCollection<any>("categorias");

      if (idStr) {

          const id = parseInt(idStr);
          const index = cats.findIndex(c => c.id === id);
          if (index > -1) {
              cats[index].nombre = nombre;
              cats[index].descripcion = desc;
          }
      } else {

          const newId = cats.length ? Math.max(...cats.map(c => c.id)) + 1 : 1;
          cats.push({ id: newId, nombre: nombre, descripcion: desc });
      }

      saveCollection("categorias", cats);
      formContainer.style.display = "none";
      renderTable();
  });

  renderTable();
});
