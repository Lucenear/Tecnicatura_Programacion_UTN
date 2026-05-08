import { PRODUCTS, getCategories } from "../../../data/data";
import type { Product, CartItem } from "../../../types/product";

const container = document.getElementById("contenedor-productos") as HTMLDivElement;
const categoriesList = document.getElementById("lista-categorias") as HTMLUListElement;
const searchInput = document.getElementById("input-busqueda") as HTMLInputElement;

let selectedCategory: number | null = null;
let searchTerm = "";

function renderProducts() {
    container.innerHTML = "";
    
    const filtered = PRODUCTS.filter(p => {
        const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || p.categorias.some(c => c.id === selectedCategory);
        return matchesSearch && matchesCategory && !p.eliminado;
    });

    filtered.forEach(product => {
        const card = document.createElement("div");
        card.className = "producto-card";
        
        card.innerHTML = `
            <img src="${new URL(`../../../assets/img/${product.imagen}`, import.meta.url).href}" alt="${product.nombre}">
            <h3>${product.nombre}</h3>
            <p>${product.descripcion}</p>
            <div class="footer-card">
                <p class="precio">$${product.precio.toFixed(2)}</p>
                <div class="acciones-card">
                    <button class="btn-agregar" id="btn-${product.id}">Agregar</button>
                </div>
            </div>
        `;
        
        const btn = card.querySelector(`#btn-${product.id}`) as HTMLButtonElement;
        btn.onclick = () => addToCart(product, btn);
        
        container.appendChild(card);
    });
}

function renderCategories() {
    categoriesList.innerHTML = '<li><a href="#" class="cat-link" data-id="0">Todas</a></li>';
    
    getCategories().forEach(cat => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#" class="cat-link" data-id="${cat.id}">${cat.nombre}</a>`;
        categoriesList.appendChild(li);
    });

    const links = document.querySelectorAll(".cat-link");
    links.forEach(link => {
        const el = link as HTMLElement;
        const id = parseInt(el.dataset.id || "0");
        
        if ((id === 0 && !selectedCategory) || id === selectedCategory) {
            el.classList.add("cat-active");
        }

        el.onclick = (e) => {
            e.preventDefault();
            selectedCategory = id === 0 ? null : id;
            renderCategories();
            renderProducts();
        };
    });
}

function updateCartCount() {
    const cartStr = localStorage.getItem("cart") || "[]";
    const cart: CartItem[] = JSON.parse(cartStr);
    const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
    const cartCountEl = document.getElementById("cart-count");
    if (cartCountEl) {
        cartCountEl.innerText = totalItems.toString();
    }
}

function addToCart(product: Product, btn: HTMLButtonElement) {
    const cartStr = localStorage.getItem("cart") || "[]";
    const cart: CartItem[] = JSON.parse(cartStr);
    
    const item = cart.find(i => i.id === product.id);
    
    if (item) {
        item.cantidad += 1;
    } else {
        cart.push({
            id: product.id,
            nombre: product.nombre,
            precio: product.precio,
            cantidad: 1,
            imagen: product.imagen
        });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    
    const originalText = btn.innerText;
    btn.innerText = "Agregado";
    btn.classList.add("btn-agregado");
    
    setTimeout(() => {
        btn.innerText = originalText;
        btn.classList.remove("btn-agregado");
    }, 1000);
}

searchInput.oninput = (e) => {
    searchTerm = (e.target as HTMLInputElement).value;
    renderProducts();
};

renderCategories();
renderProducts();
updateCartCount();
