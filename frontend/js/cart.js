/**
 * KYRACE - Gestion du panier
 */

let cart = JSON.parse(localStorage.getItem("kyrace_cart")) || [];

function saveCart() {
  localStorage.setItem("kyrace_cart", JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId, productName, productPrice, size) {
  if (!size) {
    alert("Veuillez sélectionner une taille");
    return;
  }

  const existingItem = cart.find(
    (item) => item.productId === productId && item.size === size,
  );

  if (existingItem) {
    existingItem.qty++;
  } else {
    cart.push({
      productId,
      name: productName,
      price: productPrice,
      size,
      qty: 1,
    });
  }

  saveCart();
  alert(`${productName} (${size}) ajouté au panier!`);
}

function removeFromCart(productId, size) {
  cart = cart.filter(
    (item) => !(item.productId === productId && item.size === size),
  );
  saveCart();
}

function updateQty(productId, size, newQty) {
  if (newQty < 1) {
    removeFromCart(productId, size);
    return;
  }
  const item = cart.find(
    (item) => item.productId === productId && item.size === size,
  );
  if (item) {
    item.qty = newQty;
    saveCart();
  }
}

function updateCartUI() {
  const countEl = document.getElementById("cart-count");
  const itemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  if (!itemsEl) return;

  // Mettre à jour le compte
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  if (countEl) countEl.textContent = totalItems;

  // Afficher les items
  if (cart.length === 0) {
    itemsEl.innerHTML = '<div class="cart-empty"><p>Panier vide</p></div>';
    if (totalEl) totalEl.textContent = "0 FCFA";
  } else {
    itemsEl.innerHTML = cart
      .map(
        (item, idx) => `
      <div class="cart-item">
        <div class="cart-item__thumb">
          <div class="img-ph img-ph--charcoal"></div>
        </div>
        <div class="cart-item__info">
          <div class="cart-item__name">${item.name}</div>
          <div class="cart-item__meta">Taille: ${item.size}</div>
          <div class="cart-item__qty">
            <button class="qty-btn" data-idx="${idx}" data-action="minus">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" data-idx="${idx}" data-action="plus">+</button>
          </div>
        </div>
        <div class="cart-item__right">
          <div class="cart-item__price">${(item.price * item.qty).toLocaleString()} FCFA</div>
          <button class="cart-item__remove" data-idx="${idx}">×</button>
        </div>
      </div>
    `,
      )
      .join("");

    // Mettre à jour le total
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    if (totalEl) totalEl.textContent = `${total.toLocaleString()} FCFA`;
  }
}

// ===== ÉVÉNEMENTS PANIER =====
document.addEventListener("DOMContentLoaded", () => {
  const cartToggle = document.getElementById("cart-toggle-btn");
  const cartClose = document.getElementById("cart-close-btn");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartPanel = document.getElementById("cart-panel");
  const cartItems = document.getElementById("cart-items");

  if (cartToggle) {
    cartToggle.addEventListener("click", () => {
      cartOverlay.classList.add("open");
      cartPanel.classList.add("open");
      updateCartUI();
    });
  }

  if (cartClose) {
    cartClose.addEventListener("click", () => {
      cartOverlay.classList.remove("open");
      cartPanel.classList.remove("open");
    });
  }

  if (cartOverlay) {
    cartOverlay.addEventListener("click", () => {
      cartOverlay.classList.remove("open");
      cartPanel.classList.remove("open");
    });
  }

  // Délégation: boutons qty et remove
  if (cartItems) {
    cartItems.addEventListener("click", (e) => {
      const idx = e.target.getAttribute("data-idx");
      if (!idx) return;

      if (e.target.hasAttribute("data-action")) {
        const action = e.target.getAttribute("data-action");
        const item = cart[idx];
        if (action === "plus")
          updateQty(item.productId, item.size, item.qty + 1);
        if (action === "minus")
          updateQty(item.productId, item.size, item.qty - 1);
      } else if (e.target.classList.contains("cart-item__remove")) {
        const item = cart[idx];
        removeFromCart(item.productId, item.size);
      }
    });
  }

  // Bouton ajouter au panier (délégation)
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("product-card__add")) {
      const productId = e.target.getAttribute("data-product-id");
      const productName = e.target.getAttribute("data-product-name");
      const productPrice = parseFloat(
        e.target.getAttribute("data-product-price"),
      );

      // Trouver la taille sélectionnée
      const sizeButtons = e.target.parentElement.querySelector(
        ".product-card__sizes",
      );
      const selectedSize =
        sizeButtons?.querySelector(".size-btn.selected")?.textContent;

      addToCart(productId, productName, productPrice, selectedSize);
    }
  });

  // Sélection taille
  document.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("size-btn") &&
      !e.target.classList.contains("disabled")
    ) {
      const sizesContainer = e.target.parentElement;
      sizesContainer
        .querySelectorAll(".size-btn")
        .forEach((btn) => btn.classList.remove("selected"));
      e.target.classList.add("selected");
    }
  });

  // Checkout
  document.getElementById("checkout-btn")?.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Panier vide");
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const confirmed = confirm(
      `Total: ${total.toLocaleString()} FCFA\n\nVeuillez compléter vos coordonnées en page de contact.`,
    );

    if (confirmed) {
      // Sauvegarder la commande
      fetch("/api/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: {
            prenom: "",
            nom: "",
            email: "",
            telephone: "",
          },
          items: cart.map((item) => ({
            produitId: item.productId,
            name: item.name,
            price: item.price,
            taille: item.size,
            quantity: item.qty,
            subtotal: item.price * item.qty,
          })),
          total,
        }),
      })
        .then((res) => res.json())
        .then((commande) => {
          alert(`Commande créée: ${commande.numero}`);
          cart = [];
          saveCart();
          document.getElementById("cart-overlay").classList.remove("open");
          document.getElementById("cart-panel").classList.remove("open");
        })
        .catch((err) => alert("Erreur lors de la création de commande"));
    }
  });

  // Initialiser l'affichage
  updateCartUI();
});
