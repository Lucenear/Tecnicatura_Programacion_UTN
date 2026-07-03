import { getCollection } from "../../../utils/db";
import { getUser, removeUser } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutButton") as HTMLElement;
  const productDetail = document.getElementById("product-detail") as HTMLElement;
  const cartCount = document.getElementById("cart-count") as HTMLElement;

  logoutBtn.addEventListener("click", () => {
    removeUser();
    navigate("/src/pages/auth/login/index.html");
  });

  const currentUserStr = getUser();
  let isAdmin = false;
  if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      isAdmin = currentUser.rol === "ADMIN" || currentUser.role === "ADMIN";
      if (isAdmin) {
          const linkOrders = document.getElementById("link-orders");
          const linkCart = document.getElementById("link-cart");
          if (linkOrders) linkOrders.style.display = "none";
          if (linkCart) linkCart.style.display = "none";
          
          const nav = document.getElementById("store-nav");
          if (nav) {
              const adminLink = document.createElement("a");
              adminLink.href = "../../admin/adminHome/index.html";
              adminLink.textContent = "Panel Admin";
              nav.insertBefore(adminLink, logoutBtn);
          }
      }
  }

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const count = cart.reduce((acc: number, item: any) => acc + item.cantidad, 0);
    if (count > 0) {
      cartCount.style.display = "inline-block";
      cartCount.textContent = count.toString();
    } else {
      cartCount.style.display = "none";
    }
  };

  updateCartCount();

  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id') || "0");
  
  if (!productId) {
      navigate("/src/pages/store/home/index.html");
      return;
  }

  const productos = getCollection<any>("productos");
  const prod = productos.find(p => p.id === productId);

  if (!prod) {
      productDetail.innerHTML = "<h2>Producto no encontrado</h2>";
      return;
  }

  productDetail.innerHTML = `
    <div class="detail-img animate-fade-in">
        <img src="${prod.imagen}" alt="${prod.nombre}">
    </div>
    <div class="detail-info animate-fade-in">
        <span class="badge" style="background: #e1b12c; color: #fff; width: fit-content; margin-bottom: 1rem;">
            ${prod.categoria?.nombre || 'General'}
        </span>
        <h2>${prod.nombre}</h2>
        <p class="precio">$${prod.precio.toLocaleString("es-AR")}</p>
        <p class="desc">${prod.descripcion}</p>
        <p class="stock">Disponibles: ${prod.stock} unidades</p>
        
        ${!isAdmin ? `
        <div class="quantity-selector">
            <button class="btn btn-secondary" id="btn-minus">-</button>
            <input type="number" id="input-qty" value="1" min="1" max="${prod.stock}" readonly>
            <button class="btn btn-secondary" id="btn-plus">+</button>
        </div>
        
        <button class="btn btn-primary" id="btn-add-cart" style="max-width: 300px; padding: 1.2rem; font-size: 1.1rem;">
            Agregar al Carrito
        </button>
        ` : '<p style="color: var(--color-primario); font-weight: 600; margin-top: 1rem;">Vista de Administrador (Solo lectura)</p>'}
    </div>
  `;

  if (!isAdmin) {
      let qty = 1;
      const inputQty = document.getElementById("input-qty") as HTMLInputElement;
      const btnMinus = document.getElementById("btn-minus") as HTMLButtonElement;
      const btnPlus = document.getElementById("btn-plus") as HTMLButtonElement;
      const btnAddCart = document.getElementById("btn-add-cart") as HTMLButtonElement;

      btnMinus.addEventListener("click", () => {
          if (qty > 1) {
              qty--;
              inputQty.value = qty.toString();
          }
      });

      btnPlus.addEventListener("click", () => {
          if (qty < prod.stock) {
              qty++;
              inputQty.value = qty.toString();
          }
      });

      btnAddCart.addEventListener("click", () => {
          const cart = JSON.parse(localStorage.getItem("cart") || "[]");
          const existing = cart.find((item: any) => item.producto.id === prod.id);
          
          if (existing) {
              existing.cantidad += qty;
              if(existing.cantidad > prod.stock) existing.cantidad = prod.stock;
              existing.subtotal = existing.cantidad * prod.precio;
          } else {
              cart.push({ cantidad: qty, subtotal: qty * prod.precio, producto: prod });
          }
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartCount();
          
          const originalText = btnAddCart.innerHTML;
          btnAddCart.innerHTML = "¡Agregado al carrito! ✓";
          btnAddCart.style.background = "#2ecc71";
          setTimeout(() => {
              btnAddCart.innerHTML = originalText;
              btnAddCart.style.background = "";
          }, 1500);
      });
  }
});
