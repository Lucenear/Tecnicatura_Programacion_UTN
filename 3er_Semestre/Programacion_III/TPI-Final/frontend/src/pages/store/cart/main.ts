import { getCollection, saveCollection } from "../../../utils/db";
import { getUser, removeUser } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutButton") as HTMLElement;
  const cartContent = document.getElementById("cart-content") as HTMLElement;
  const cartCount = document.getElementById("cart-count") as HTMLElement;

  logoutBtn.addEventListener("click", () => {
    removeUser();
    navigate("/src/pages/auth/login/index.html");
  });

  const renderCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    

    const count = cart.reduce((acc: number, item: any) => acc + item.cantidad, 0);
    if (count > 0) {
      cartCount.style.display = "inline-block";
      cartCount.textContent = count.toString();
    } else {
      cartCount.style.display = "none";
    }

    if (cart.length === 0) {
      cartContent.innerHTML = `
        <div class="empty-cart animate-fade-in" style="width: 100%;">
            <h2>Tu carrito está vacío</h2>
            <p style="color: #666; margin: 1rem 0 2rem 0;">¡Parece que aún no has agregado ningún producto!</p>
            <button class="btn btn-primary" onclick="window.location.href='../home/index.html'">Volver al catálogo</button>
        </div>
      `;
      return;
    }

    let itemsHtml = '<div class="cart-items">';
    let total = 0;

    cart.forEach((item: any, index: number) => {
        total += item.subtotal;
        itemsHtml += `
            <div class="cart-item animate-fade-in">
                <img src="${item.producto.imagen}" alt="${item.producto.nombre}">
                <div class="cart-item-info">
                    <h3>${item.producto.nombre}</h3>
                    <p>Precio Unitario: $${item.producto.precio.toLocaleString("es-AR")}</p>
                    <div class="cart-item-price" style="margin-top: 0.5rem;">Subtotal: $${item.subtotal.toLocaleString("es-AR")}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-selector" style="margin: 0;">
                        <button class="btn btn-secondary btn-update-qty" data-idx="${index}" data-action="minus" style="padding: 0.5rem 1rem;">-</button>
                        <input type="number" value="${item.cantidad}" readonly style="width: 50px; padding: 0.5rem; font-size: 1.1rem;">
                        <button class="btn btn-secondary btn-update-qty" data-idx="${index}" data-action="plus" data-stock="${item.producto.stock}" style="padding: 0.5rem 1rem;">+</button>
                    </div>
                    <button class="btn-remove" data-idx="${index}" style="display: flex; align-items: center; justify-content: center;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    });
    itemsHtml += '</div>';

    const summaryHtml = `
        <div class="cart-summary animate-fade-in">
            <h3>Resumen de Compra</h3>
            <div style="margin-top: 1.5rem;">
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>$${total.toLocaleString("es-AR")}</span>
                </div>
                <div class="summary-row">
                    <span>Envío</span>
                    <span style="color: #2ecc71;">Gratis</span>
                </div>
                
                <div class="form-group" style="margin-top: 1.5rem; text-align: left;">
                    <label for="forma-pago">Forma de Pago</label>
                    <select id="forma-pago">
                        <option value="EFECTIVO">Efectivo</option>
                        <option value="TARJETA">Tarjeta de Crédito</option>
                        <option value="TRANSFERENCIA">Transferencia</option>
                    </select>
                </div>

                <div class="summary-row summary-total">
                    <span>Total</span>
                    <span>$${total.toLocaleString("es-AR")}</span>
                </div>
                
                <button id="btn-checkout" class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1.1rem; margin-top: 1rem;">
                    Confirmar Pedido
                </button>
            </div>
        </div>
    `;

    cartContent.innerHTML = itemsHtml + summaryHtml;


    document.querySelectorAll('.btn-update-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            const idx = parseInt(target.getAttribute('data-idx') || "0");
            const action = target.getAttribute('data-action');
            const stock = parseInt(target.getAttribute('data-stock') || "0");
            
            if (action === 'minus') {
                if (cart[idx].cantidad > 1) {
                    cart[idx].cantidad--;
                    cart[idx].subtotal = cart[idx].cantidad * cart[idx].producto.precio;
                }
            } else if (action === 'plus') {
                if (cart[idx].cantidad < stock) {
                    cart[idx].cantidad++;
                    cart[idx].subtotal = cart[idx].cantidad * cart[idx].producto.precio;
                }
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
        });
    });

    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-idx') || "0");
            cart.splice(idx, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
        });
    });

    document.getElementById('btn-checkout')?.addEventListener('click', () => {
        const currentUserStr = getUser();
        if (!currentUserStr) {
            alert("Debes iniciar sesión para completar la compra.");
            navigate("/src/pages/auth/login/index.html");
            return;
        }

        const currentUser = JSON.parse(currentUserStr);
        const formaPago = (document.getElementById('forma-pago') as HTMLSelectElement).value;
        const pedidos = getCollection<any>("pedidos");
        const productos = getCollection<any>("productos");
        

        let outOfStock = false;
        cart.forEach((item: any) => {
            const prodIdx = productos.findIndex(p => p.id === item.producto.id);
            if (prodIdx > -1 && productos[prodIdx].stock < item.cantidad) {
                outOfStock = true;
                alert(`No hay stock suficiente para ${item.producto.nombre}. Disponible: ${productos[prodIdx].stock}`);
            }
        });

        if (outOfStock) return;


        cart.forEach((item: any) => {
            const prodIdx = productos.findIndex(p => p.id === item.producto.id);
            if (prodIdx > -1) {
                productos[prodIdx].stock -= item.cantidad;
            }
        });
        saveCollection("productos", productos);

        const newOrder = {
            id: pedidos.length ? Math.max(...pedidos.map(p => p.id)) + 1 : 1,
            fecha: new Date().toISOString().split('T')[0],
            estado: "PENDIENTE",
            total: total,
            formaPago: formaPago,
            detalles: cart,
            usuarioDto: currentUser
        };

        pedidos.push(newOrder);
        saveCollection("pedidos", pedidos);


        localStorage.removeItem("cart");
        alert("¡Pedido realizado con éxito!");
        navigate("/src/pages/client/orders/index.html");
    });
  };

  renderCart();
});
