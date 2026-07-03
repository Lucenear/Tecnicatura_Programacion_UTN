import { getCollection } from "../../../utils/db";
import { getUser, removeUser } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutButton") as HTMLElement;
  const ordersContainer = document.getElementById("orders-container") as HTMLElement;

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

  const pedidos = getCollection<any>("pedidos");
  const misPedidos = pedidos.filter(p => p.usuarioDto.id === currentUser.id).sort((a, b) => b.id - a.id);

  if (misPedidos.length === 0) {
      ordersContainer.innerHTML = `
        <div style="text-align: center; padding: 4rem; background: white; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
            <h3>No has realizado pedidos aún</h3>
            <p style="color: #666; margin: 1rem 0;">Descubre nuestro delicioso menú y haz tu primer pedido.</p>
            <button class="btn btn-primary" onclick="window.location.href='../../store/home/index.html'">Ver Catálogo</button>
        </div>
      `;
      return;
  }

  let html = "";
  misPedidos.forEach((pedido: any) => {
      let detallesHtml = "";
      pedido.detalles.forEach((d: any) => {
          detallesHtml += `
            <div class="detail-item">
                <img src="${d.producto.imagen}" alt="${d.producto.nombre}">
                <div>
                    <p><strong>${d.cantidad}x</strong> ${d.producto.nombre}</p>
                    <p style="color: #666;">Subtotal: $${d.subtotal.toLocaleString("es-AR")}</p>
                </div>
            </div>
          `;
      });

      html += `
        <div class="order-card animate-fade-in">
            <div class="order-header">
                <div>
                    <h3>Pedido #${pedido.id}</h3>
                    <p style="color: #666; font-size: 0.9rem;">Fecha: ${pedido.fecha} | Pago: ${pedido.formaPago}</p>
                </div>
                <div>
                    <span class="badge ${pedido.estado}">${pedido.estado}</span>
                </div>
            </div>
            <div class="order-details-grid">
                ${detallesHtml}
            </div>
            <div style="text-align: right; border-top: 1px solid #eee; padding-top: 1rem; margin-top: 1rem;">
                <h4 style="color: var(--color-primario);">Total: $${pedido.total.toLocaleString("es-AR")}</h4>
            </div>
        </div>
      `;
  });

  ordersContainer.innerHTML = html;
});
