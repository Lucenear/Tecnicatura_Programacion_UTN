import type { CartItem } from "../../../types/product";

const content = document.getElementById("cart-content") as HTMLDivElement;
const footer = document.getElementById("cart-footer") as HTMLDivElement;
const totalSpan = document.getElementById("cart-total") as HTMLSpanElement;
const clearBtn = document.getElementById("btn-vaciar") as HTMLButtonElement;

(window as any).updateQuantity = (id: number, qty: number) => {
    if (qty < 1) return;
    const cartStr = localStorage.getItem("cart") || "[]";
    let cart: CartItem[] = JSON.parse(cartStr);
    const item = cart.find(i => i.id === id);
    if (item) {
        item.cantidad = qty;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }
};

(window as any).removeFromCart = (id: number) => {
    const cart = getCart().filter(i => i.id !== id);
    saveCart(cart);
    renderCart();
};

function getCart(): CartItem[] {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
}

function saveCart(cart: CartItem[]) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
    const cartCountEl = document.getElementById("cart-count");
    if (cartCountEl) {
        cartCountEl.innerText = totalItems.toString();
    }
}

function renderCart() {
    const items = getCart();
    
    if (items.length === 0) {
        content.innerHTML = '<div class="empty-message">No hay productos en el carrito</div>';
        footer.style.display = "none";
        updateCartCount();
        return;
    }

    footer.style.display = "block";
    let tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    let total = 0;

    items.forEach(item => {
        const sub = item.precio * item.cantidad;
        total += sub;
        tableHtml += `
            <tr>
                <td>${item.nombre}</td>
                <td>$${item.precio.toFixed(2)}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem; justify-content: center;">
                        <button class="btn-cantidad" onclick="window.updateQuantity(${item.id}, ${item.cantidad - 1})">-</button>
                        <span style="width: 30px; text-align: center; font-weight: bold;">${item.cantidad}</span>
                        <button class="btn-cantidad" onclick="window.updateQuantity(${item.id}, ${item.cantidad + 1})">+</button>
                    </div>
                </td>
                <td>$${sub.toFixed(2)}</td>
                <td>
                    <button class="btn-eliminar" onclick="window.removeFromCart(${item.id})">Eliminar producto</button>
                </td>
            </tr>
        `;
    });

    tableHtml += '</tbody></table>';
    content.innerHTML = tableHtml;
    totalSpan.innerText = `$${total.toFixed(2)}`;

    updateCartCount();
}

clearBtn.onclick = () => {
    saveCart([]);
    renderCart();
};

renderCart();
