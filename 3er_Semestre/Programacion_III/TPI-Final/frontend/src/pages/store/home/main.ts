import { getCollection } from "../../../utils/db";
import { getUser, removeUser } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutButton") as HTMLElement;
  const listaCategorias = document.getElementById("lista-categorias") as HTMLUListElement;
  const contenedorProductos = document.getElementById("contenedor-productos") as HTMLElement;
  const formBusqueda = document.getElementById("form-busqueda") as HTMLFormElement;
  const inputBusqueda = document.getElementById("input-busqueda") as HTMLInputElement;
  const selectOrden = document.getElementById("select-orden") as HTMLSelectElement;
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

  const categorias = getCollection<any>("categorias");
  let productos = getCollection<any>("productos").filter(p => p.disponible);
  let currentCategory: number | null = null;

  const cargarCategorias = (): void => {
    listaCategorias.innerHTML = `<li><a class="pill-categoria active" data-id="all">Todos</a></li>`;
    categorias.forEach((categoria) => {
      const li = document.createElement("li");
      li.innerHTML = `<a class="pill-categoria" data-id="${categoria.id}">${categoria.nombre}</a>`;
      listaCategorias.appendChild(li);
    });

    listaCategorias.querySelectorAll(".pill-categoria").forEach(pill => {
      pill.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        listaCategorias.querySelectorAll(".pill-categoria").forEach(p => p.classList.remove("active"));
        target.classList.add("active");
        
        const catId = target.getAttribute("data-id");
        currentCategory = catId === "all" ? null : parseInt(catId || "0");
        cargarProductos(inputBusqueda.value);
      });
    });
  };

  const cargarProductos = (filtro: string = ""): void => {
    contenedorProductos.innerHTML = "";
    let filtrados = productos.filter((p) => {
      const matchName = p.nombre.toLowerCase().includes(filtro.toLowerCase());
      const matchCat = currentCategory ? (p.categoria?.id === currentCategory || p.categoriaId === currentCategory) : true;
      return matchName && matchCat;
    });

    const orden = selectOrden.value;
    filtrados.sort((a, b) => {
        if (orden === "nombre_az") return a.nombre.localeCompare(b.nombre);
        if (orden === "nombre_za") return b.nombre.localeCompare(a.nombre);
        if (orden === "precio_asc") return a.precio - b.precio;
        if (orden === "precio_desc") return b.precio - a.precio;
        return 0;
    });

    if (filtrados.length === 0) {
      contenedorProductos.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #666;">No se encontraron productos.</p>`;
      return;
    }

    filtrados.forEach((p) => {
      const card = document.createElement("article");
      card.className = "producto-card animate-fade-in";
      card.innerHTML = `
        <img src="${p.imagen}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p class="desc">${p.descripcion}</p>
        <p class="precio">$${p.precio.toLocaleString("es-AR")}</p>
        <div class="acciones-card">
          <button class="btn btn-secondary btn-detalles" data-id="${p.id}">Ver Detalles</button>
          ${!isAdmin ? `<button class="btn btn-primary btn-agregar" data-id="${p.id}">Agregar al Carrito</button>` : ''}
        </div>
      `;
      contenedorProductos.appendChild(card);


      card.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        if (!target.classList.contains("btn-agregar")) {
          navigate(`/src/pages/store/productDetail/index.html?id=${p.id}`);
        }
      });
    });


    contenedorProductos.querySelectorAll(".btn-agregar").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt((e.currentTarget as HTMLElement).getAttribute("data-id") || "0");
        const prod = productos.find(p => p.id === id);
        if (prod) {
          const cart = JSON.parse(localStorage.getItem("cart") || "[]");
          const existing = cart.find((item: any) => item.producto.id === id);
          if (existing) {
            existing.cantidad += 1;
            existing.subtotal = existing.cantidad * prod.precio;
          } else {
            cart.push({ cantidad: 1, subtotal: prod.precio, producto: prod });
          }
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartCount();
          

          const originalText = btn.innerHTML;
          btn.innerHTML = "¡Agregado! ✓";
          (btn as HTMLElement).style.background = "#2ecc71";
          setTimeout(() => {
            btn.innerHTML = originalText;
            (btn as HTMLElement).style.background = "";
          }, 1000);
        }
      });
    });
  };

  formBusqueda.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();
    cargarProductos(inputBusqueda.value);
  });

  inputBusqueda.addEventListener("input", () => {
    cargarProductos(inputBusqueda.value);
  });

  selectOrden.addEventListener("change", () => {
    cargarProductos(inputBusqueda.value);
  });

  cargarCategorias();
  cargarProductos();
});
