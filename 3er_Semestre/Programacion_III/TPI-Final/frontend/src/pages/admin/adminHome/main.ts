import { getCollection } from "../../../utils/db";
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

  const pedidos = getCollection<any>("pedidos");
  const productos = getCollection<any>("productos");


  const totalPedidos = pedidos.length;
  const totalIngresos = pedidos.reduce((acc, p) => acc + p.total, 0);
  const totalProductosActivos = productos.filter(p => p.disponible).length;

  document.getElementById("stat-pedidos")!.textContent = totalPedidos.toString();
  document.getElementById("stat-ingresos")!.textContent = `$${totalIngresos.toLocaleString("es-AR")}`;
  document.getElementById("stat-productos")!.textContent = totalProductosActivos.toString();


  const tbody = document.querySelector("#recent-orders-table tbody") as HTMLElement;
  const recentOrders = [...pedidos].sort((a, b) => b.id - a.id).slice(0, 5);

  let html = "";
  if (recentOrders.length === 0) {
      html = `<tr><td colspan="5" style="text-align:center;">No hay pedidos recientes.</td></tr>`;
  } else {
      recentOrders.forEach(p => {
          html += `
            <tr class="animate-fade-in">
                <td>#${p.id}</td>
                <td>${p.fecha}</td>
                <td>${p.usuarioDto?.nombre} ${p.usuarioDto?.apellido}</td>
                <td style="font-weight:bold; color:var(--color-primario);">$${p.total.toLocaleString("es-AR")}</td>
                <td><span class="badge ${p.estado}">${p.estado}</span></td>
            </tr>
          `;
      });
  }
  tbody.innerHTML = html;
});
