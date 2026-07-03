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
  const filterEstado = document.getElementById("filter-estado") as HTMLSelectElement;

  const renderTable = () => {
      let pedidos = getCollection<any>("pedidos");
      pedidos.sort((a, b) => b.id - a.id);

      const estadoFiltro = filterEstado.value;
      if (estadoFiltro !== "TODOS") {
          pedidos = pedidos.filter(p => p.estado === estadoFiltro);
      }

      let html = "";
      if (pedidos.length === 0) {
          html = `<tr><td colspan="8" style="text-align:center;">No hay pedidos en el sistema.</td></tr>`;
      } else {
          pedidos.forEach(p => {
              let detallesHtml = "<ul style='margin: 0; padding-left: 1.2rem; font-size: 0.85rem; color: #555;'>";
              p.detalles.forEach((d: any) => {
                  detallesHtml += `<li style="margin-bottom: 0.2rem;"><b>${d.cantidad}x</b> ${d.producto.nombre}</li>`;
              });
              detallesHtml += "</ul>";

              html += `
                <tr class="animate-fade-in">
                    <td>#${p.id}</td>
                    <td>${p.fecha}</td>
                    <td>${p.usuarioDto?.nombre} ${p.usuarioDto?.apellido}<br><small style="color:#666;">${p.usuarioDto?.mail}</small></td>
                    <td>${p.formaPago}</td>
                    <td>${detallesHtml}</td>
                    <td style="font-weight:bold; color:var(--color-primario);">$${p.total.toLocaleString("es-AR")}</td>
                    <td><span class="badge ${p.estado}">${p.estado}</span></td>
                    <td>
                        <select class="estado-select" data-id="${p.id}" style="padding: 0.4rem 0.5rem; min-width: 150px; border-radius: 5px; border: 1px solid var(--color-borde); cursor: pointer; outline: none;">
                            <option value="PENDIENTE" ${p.estado === 'PENDIENTE' ? 'selected' : ''}>Pendiente</option>
                            <option value="EN_PREPARACION" ${p.estado === 'EN_PREPARACION' ? 'selected' : ''}>En Preparación</option>
                            <option value="ENTREGADO" ${p.estado === 'ENTREGADO' ? 'selected' : ''}>Entregado</option>
                        </select>
                    </td>
                </tr>
              `;
          });
      }
      tbody.innerHTML = html;

      document.querySelectorAll(".estado-select").forEach(select => {
          select.addEventListener("change", (e) => {
              const target = e.currentTarget as HTMLSelectElement;
              const id = parseInt(target.getAttribute("data-id") || "0");
              const newState = target.value;
              
              let peds = getCollection<any>("pedidos");
              const idx = peds.findIndex(p => p.id === id);
              if (idx > -1) {
                  peds[idx].estado = newState;
                  saveCollection("pedidos", peds);
                  renderTable();
              }
          });
      });
  };

  filterEstado.addEventListener("change", renderTable);

  renderTable();
});
