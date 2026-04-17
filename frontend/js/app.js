/**
 * KYRACE Frontend - App JS
 * Gestion SPA, routing, chargement des produits
 */

const API_BASE = "/api";
let allProduits = [];
let currentView = "home";

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  setupRouting();
  setupScrollNav();
  loadFeaturedProducts();
});

// ===== ROUTING SPA =====
function setupRouting() {
  document.querySelectorAll("[data-route]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const route = btn.getAttribute("data-route");
      navigate(route);
    });
  });
}

function navigate(view) {
  // Masquer tous les views
  document
    .querySelectorAll(".view")
    .forEach((v) => v.classList.remove("active"));

  // Afficher le view demandé
  const targetView = document.getElementById(`view-${view}`);
  if (targetView) {
    targetView.classList.add("active");
    currentView = view;

    // Charger le contenu si nécessaire
    if (view === "boutique") {
      loadBoutiqueProducts();
    } else if (view === "survet") {
      loadCategoryProducts("survet");
    } else if (view === "costume") {
      loadCategoryProducts("costume");
    } else if (view === "accessoires") {
      loadCategoryProducts("accessoires");
    }

    // Scroll au top
    window.scrollTo(0, 0);
  }
}

// ===== PRODUITS =====
async function loadFeaturedProducts() {
  try {
    const res = await fetch(`${API_BASE}/produits/vedettes`);
    const vedettes = await res.json();
    allProduits = vedettes;
    renderFeaturedGrid(vedettes);
  } catch (err) {
    console.error("Erreur chargement vedettes:", err);
  }
}

async function loadBoutiqueProducts(filter = "all") {
  try {
    let url = `${API_BASE}/produits`;
    if (filter !== "all") {
      url += `?category=${filter}`;
    }
    const res = await fetch(url);
    const produits = await res.json();
    allProduits = produits;
    renderBoutiqueGrid(produits);
    updateProductCount(produits.length);
  } catch (err) {
    console.error("Erreur chargement boutique:", err);
  }
}

async function loadCategoryProducts(category) {
  try {
    const res = await fetch(`${API_BASE}/produits?category=${category}`);
    const produits = await res.json();
    allProduits = produits;
    const gridId = `${category}-grid`;
    const grid = document.getElementById(gridId);
    if (grid) {
      grid.innerHTML = createProductHTML(produits);
    }
  } catch (err) {
    console.error(`Erreur chargement ${category}:`, err);
  }
}

function renderFeaturedGrid(produits) {
  const grid = document.getElementById("featured-grid");
  if (!grid) return;
  grid.innerHTML = createProductHTML(produits);
}

function renderBoutiqueGrid(produits) {
  const grid = document.getElementById("boutique-grid");
  if (!grid) return;
  grid.innerHTML = createProductHTML(produits);
}

function createProductHTML(produits) {
  return produits
    .map(
      (p) => `
    <article class="product-card">
      <div class="product-card__thumb">
        <div class="product-card__img-wrap">
          <div class="img-ph ${p.colorClass}" style="width:100%;height:100%;"></div>
          <div class="product-card__badges">
            ${p.vedette ? '<span class="badge badge--vedette">Vedette</span>' : ""}
            ${p.promo ? '<span class="badge badge--promo">Promo</span>' : ""}
          </div>
          <div class="product-card__actions">
            <div class="product-card__sizes" data-product-id="${p._id}">
              ${["S", "M", "L", "XL", "XXL"]
                .map((size) => {
                  const stockQty = p.sizes[size] || 0;
                  const isDisabled = stockQty === 0;
                  return `<button class="size-btn ${isDisabled ? "disabled" : ""}" data-size="${size}" data-product-id="${p._id}" ${isDisabled ? "disabled" : ""}>${size}</button>`;
                })
                .join("")}
            </div>
            <button class="product-card__add" data-product-id="${p._id}" data-product-name="${p.name}" data-product-price="${p.price}">Ajouter au panier</button>
          </div>
        </div>
      </div>
      <div class="product-card__info">
        <h3 class="product-card__name">${p.name}</h3>
        <span class="product-card__cat">${p.category}</span>
        <div>
          <span class="product-card__price">${p.price.toLocaleString()} FCFA</span>
          ${p.oldPrice ? `<span class="product-card__old-price">${p.oldPrice.toLocaleString()} FCFA</span>` : ""}
        </div>
      </div>
    </article>
  `,
    )
    .join("");
}

function updateProductCount(count) {
  const countEl = document.getElementById("boutique-count");
  if (countEl) {
    countEl.textContent = `${count} produit${count > 1 ? "s" : ""}`;
  }
}

// ===== NAV SCROLL =====
function setupScrollNav() {
  const nav = document.getElementById("main-nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });
}

// ===== FILTRES BOUTIQUE =====
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("filter-tab")) {
      document
        .querySelectorAll(".filter-tab")
        .forEach((tab) => tab.classList.remove("active"));
      e.target.classList.add("active");

      const filterValue = e.target.getAttribute("data-filter");
      if (filterValue === "all") {
        loadBoutiqueProducts();
      } else {
        loadBoutiqueProducts(filterValue);
      }
    }
  });
});

// ===== BOUTIQUE SEARCH =====
const boutiqueSearchInput = document.getElementById("boutique-search");
if (boutiqueSearchInput) {
  boutiqueSearchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = allProduits.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query),
    );
    renderBoutiqueGrid(filtered);
    updateProductCount(filtered.length);
  });
}
