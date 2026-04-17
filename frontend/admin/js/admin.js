/**
 * KYRACE Admin Dashboard JS
 */

const API = "/api";
let authToken = localStorage.getItem("kyrace_admin_token");

// ===== WAIT FOR DOM =====
document.addEventListener("DOMContentLoaded", () => {
  initAdmin();
});

function initAdmin() {
  // Si pas de token, afficher le login
  if (!authToken) {
    document
      .querySelectorAll(".admin-section:not(#section-login)")
      .forEach((s) => {
        s.style.display = "none";
      });
    const nav = document.querySelector(".admin-nav");
    if (nav) nav.style.display = "none";

    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
      loginBtn.addEventListener("click", handleLogin);
    }
    return;
  }

  // Si token existe, masquer le login et afficher le menu
  const loginSection = document.getElementById("section-login");
  if (loginSection) {
    loginSection.style.display = "none";
  }

  setupNavigation();
  setupProducts();
  setupPromos();
  setupLogout();

  // Charger les produits par défaut
  const productsSection = document.getElementById("section-products");
  if (productsSection) {
    productsSection.style.display = "block";
    loadProducts();
  }
}

// ===== LOGIN =====
async function handleLogin() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const errorEl = document.getElementById("login-error");

  if (!email || !password) {
    if (errorEl) errorEl.textContent = "Champs requis";
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Identifiants invalides");
    }

    const data = await res.json();
    authToken = data.token;
    localStorage.setItem("kyrace_admin_token", authToken);
    location.reload();
  } catch (err) {
    if (errorEl) errorEl.textContent = err.message;
  }
}

// ===== LOGOUT =====
function setupLogout() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("kyrace_admin_token");
      location.reload();
    });
  }
}

// ===== NAVIGATION =====
function setupNavigation() {
  document.querySelectorAll(".admin-nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.getAttribute("data-section");

      document
        .querySelectorAll(".admin-nav-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      document
        .querySelectorAll(".admin-section")
        .forEach((s) => (s.style.display = "none"));

      const sectionEl = document.getElementById(`section-${section}`);
      if (sectionEl) {
        sectionEl.style.display = "block";
      }

      if (section === "products") loadProducts();
      if (section === "commandes") loadCommandes();
      if (section === "messages") loadMessages();
      if (section === "promos") loadPromos();
      if (section === "stats") loadStats();
    });
  });
}

// ===== PRODUCTS SECTION =====
document.getElementById("add-product-btn").addEventListener("click", () => {
  resetProductForm();
  document.getElementById("product-form").style.display = "block";
});

document.getElementById("cancel-product-btn").addEventListener("click", () => {
  document.getElementById("product-form").style.display = "none";
});

document
  .getElementById("save-product-btn")
  .addEventListener("click", async () => {
    const product = {
      name: document.getElementById("prod-name").value,
      category: document.getElementById("prod-category").value,
      price: parseFloat(document.getElementById("prod-price").value),
      oldPrice: document.getElementById("prod-old-price").value
        ? parseFloat(document.getElementById("prod-old-price").value)
        : null,
      colorClass: document.getElementById("prod-color").value,
      vedette: document.getElementById("prod-vedette").checked,
      promo: document.getElementById("prod-promo").checked,
      sizes: {
        S: parseInt(document.getElementById("prod-stock-s").value) || 0,
        M: parseInt(document.getElementById("prod-stock-m").value) || 0,
        L: parseInt(document.getElementById("prod-stock-l").value) || 0,
        XL: parseInt(document.getElementById("prod-stock-xl").value) || 0,
        XXL: parseInt(document.getElementById("prod-stock-xxl").value) || 0,
      },
    };

    try {
      const res = await fetch(`${API}/produits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(product),
      });

      if (res.ok) {
        alert("Produit créé");
        document.getElementById("product-form").style.display = "none";
        loadProducts();
      }
    } catch (err) {
      alert("Erreur: " + err.message);
    }
  });

async function loadProducts() {
  try {
    const res = await fetch(`${API}/produits`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const products = await res.json();

    const tbody = document.getElementById("products-table-body");
    tbody.innerHTML = products
      .map(
        (p) => `
      <tr>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>${p.price.toLocaleString()} FCFA</td>
        <td>${p.sizes.S + p.sizes.M + p.sizes.L + p.sizes.XL + p.sizes.XXL}</td>
        <td>${p.vedette ? "Oui ✓" : "Non"}</td>
        <td>
          <button class="btn-small" onclick="editProduct('${p._id}')">Éditer</button>
          <button class="btn-danger" onclick="deleteProduct('${p._id}')">Supprimer</button>
        </td>
      </tr>
    `,
      )
      .join("");
  } catch (err) {
    console.error("Erreur loadProducts:", err);
  }
}

async function deleteProduct(id) {
  if (!confirm("Supprimer ce produit?")) return;

  try {
    const res = await fetch(`${API}/produits/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.ok) {
      loadProducts();
    }
  } catch (err) {
    alert("Erreur: " + err.message);
  }
}

function resetProductForm() {
  document.getElementById("prod-name").value = "";
  document.getElementById("prod-category").value = "survet";
  document.getElementById("prod-price").value = "";
  document.getElementById("prod-old-price").value = "";
  document.getElementById("prod-vedette").checked = false;
  document.getElementById("prod-promo").checked = false;
  document.getElementById("prod-stock-s").value = 0;
  document.getElementById("prod-stock-m").value = 0;
  document.getElementById("prod-stock-l").value = 0;
  document.getElementById("prod-stock-xl").value = 0;
  document.getElementById("prod-stock-xxl").value = 0;
}

function editProduct(id) {
  alert("Fonctionnalité édition à implémenter");
}

// ===== COMMANDES SECTION =====
async function loadCommandes() {
  try {
    const res = await fetch(`${API}/commandes`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const commandes = await res.json();

    const tbody = document.getElementById("commandes-table-body");
    tbody.innerHTML = commandes
      .map(
        (c) => `
      <tr>
        <td>${c.numero}</td>
        <td>${c.client.prenom} ${c.client.nom}</td>
        <td>${c.total.toLocaleString()} FCFA</td>
        <td>
          <select class="stat-change" onchange="updateCommandeStatus('${c._id}', this.value)">
            <option value="en_attente" ${c.statut === "en_attente" ? "selected" : ""}>En attente</option>
            <option value="validee" ${c.statut === "validee" ? "selected" : ""}>Validée</option>
            <option value="en_route" ${c.statut === "en_route" ? "selected" : ""}>En route</option>
            <option value="livree" ${c.statut === "livree" ? "selected" : ""}>Livrée</option>
          </select>
        </td>
        <td>${new Date(c.dateCommande).toLocaleDateString("fr-FR")}</td>
        <td><button class="btn-small" onclick="viewCommande('${c._id}')">Voir</button></td>
      </tr>
    `,
      )
      .join("");
  } catch (err) {
    console.error("Erreur loadCommandes:", err);
  }
}

async function updateCommandeStatus(id, statut) {
  try {
    const res = await fetch(`${API}/commandes/${id}/statut`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ statut }),
    });
    if (res.ok) alert("Statut mis à jour");
  } catch (err) {
    alert("Erreur: " + err.message);
  }
}

function viewCommande(id) {
  alert("Détails commande " + id);
}

// ===== MESSAGES SECTION =====
async function loadMessages() {
  try {
    const res = await fetch(`${API}/messages`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const messages = await res.json();

    const tbody = document.getElementById("messages-table-body");
    tbody.innerHTML = messages
      .map(
        (m) => `
      <tr>
        <td>${m.email}</td>
        <td>${m.sujet}</td>
        <td>${m.message.substring(0, 50)}...</td>
        <td>${new Date(m.dateMessage).toLocaleDateString("fr-FR")}</td>
        <td>${m.lu ? "Lu" : "🔴 Non lu"}</td>
        <td>
          <button class="btn-small" onclick="viewMessage('${m._id}')">Voir</button>
          <button class="btn-danger" onclick="deleteMessage('${m._id}')">×</button>
        </td>
      </tr>
    `,
      )
      .join("");
  } catch (err) {
    console.error("Erreur loadMessages:", err);
  }
}

function viewMessage(id) {
  alert("Détails message " + id);
}

async function deleteMessage(id) {
  if (!confirm("Supprimer?")) return;

  try {
    const res = await fetch(`${API}/messages/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.ok) loadMessages();
  } catch (err) {
    alert("Erreur: " + err.message);
  }
}

// ===== PROMOS SECTION =====
document.getElementById("add-promo-btn").addEventListener("click", () => {
  document.getElementById("promo-form").style.display = "block";
});

document.getElementById("cancel-promo-btn").addEventListener("click", () => {
  document.getElementById("promo-form").style.display = "none";
});

document
  .getElementById("save-promo-btn")
  .addEventListener("click", async () => {
    const promo = {
      code: document.getElementById("promo-code").value.toUpperCase(),
      type: document.getElementById("promo-type").value,
      valeur: parseFloat(document.getElementById("promo-valeur").value),
      minMontant: parseFloat(document.getElementById("promo-min").value) || 0,
      dateDebut: new Date(document.getElementById("promo-start").value),
      dateFin: new Date(document.getElementById("promo-end").value),
      actif: true,
    };

    try {
      const res = await fetch(`${API}/promos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(promo),
      });

      if (res.ok) {
        alert("Code créé");
        document.getElementById("promo-form").style.display = "none";
        loadPromos();
      }
    } catch (err) {
      alert("Erreur: " + err.message);
    }
  });

async function loadPromos() {
  try {
    const res = await fetch(`${API}/promos`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const promos = await res.json();

    const tbody = document.getElementById("promos-table-body");
    tbody.innerHTML = promos
      .map(
        (p) => `
      <tr>
        <td><strong>${p.code}</strong></td>
        <td>${p.type === "pourcentage" ? "%" : "FCFA"}</td>
        <td>${p.valeur}</td>
        <td>${p.utilisations}${p.maxUtilisations ? "/" + p.maxUtilisations : "∞"}</td>
        <td>${p.estValide ? "✓ Valide" : "✗ Expiré"}</td>
        <td><button class="btn-danger" onclick="deletePromo('${p._id}')">×</button></td>
      </tr>
    `,
      )
      .join("");
  } catch (err) {
    console.error("Erreur loadPromos:", err);
  }
}

async function deletePromo(id) {
  if (!confirm("Supprimer?")) return;

  try {
    const res = await fetch(`${API}/promos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.ok) loadPromos();
  } catch (err) {
    alert("Erreur: " + err.message);
  }
}

// ===== STATS SECTION =====
async function loadStats() {
  try {
    // Commandes stats
    const commandesRes = await fetch(`${API}/commandes/admin/statistiques`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const stats = await commandesRes.json();

    document.getElementById("stat-total-orders").textContent =
      stats.totalCommandes || 0;
    document.getElementById("stat-total-revenue").textContent =
      (stats.totalRevenu || 0).toLocaleString() + " FCFA";

    // Messages stats
    const messagesRes = await fetch(`${API}/messages/admin/statistiques`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const msgStats = messagesRes.ok ? await messagesRes.json() : {};
    document.getElementById("stat-unread-messages").textContent =
      msgStats.nonLus || 0;

    // Products count
    const productsRes = await fetch(`${API}/produits`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const products = await productsRes.json();
    document.getElementById("stat-total-products").textContent =
      products.length || 0;
  } catch (err) {
    console.error("Erreur loadStats:", err);
  }
}
