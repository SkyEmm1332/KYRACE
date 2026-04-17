/**
 * KYRACE - Gestion de la recherche
 */

const searchOpenBtn = document.getElementById("search-open-btn");
const searchCloseBtn = document.getElementById("search-close-btn");
const searchOverlay = document.getElementById("search-overlay");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

if (searchOpenBtn) {
  searchOpenBtn.addEventListener("click", () => {
    searchOverlay.classList.add("open");
    searchInput.focus();
  });
}

if (searchCloseBtn) {
  searchCloseBtn.addEventListener("click", () => {
    searchOverlay.classList.remove("open");
    searchInput.value = "";
    searchResults.innerHTML = "";
  });
}

if (searchOverlay) {
  searchOverlay.addEventListener("click", (e) => {
    if (e.target === searchOverlay) {
      searchOverlay.classList.remove("open");
    }
  });
}

if (searchInput) {
  searchInput.addEventListener("input", async (e) => {
    const query = e.target.value.trim();

    if (!query) {
      searchResults.innerHTML = "";
      return;
    }

    try {
      const res = await fetch(
        `/api/produits?search=${encodeURIComponent(query)}`,
      );
      const produits = await res.json();

      if (produits.length === 0) {
        searchResults.innerHTML =
          '<div class="search-no-result">Aucun résultat</div>';
        return;
      }

      searchResults.innerHTML = produits
        .slice(0, 8)
        .map(
          (p) => `
        <div class="search-result-item" data-route="boutique">
          <div class="search-result-thumb" style="background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);"></div>
          <div>
            <div class="search-result-name">${p.name}</div>
            <div class="search-result-cat">${p.category}</div>
          </div>
          <div class="search-result-price">${p.price.toLocaleString()} FCFA</div>
        </div>
      `,
        )
        .join("");
    } catch (err) {
      searchResults.innerHTML =
        '<div class="search-no-result">Erreur de recherche</div>';
    }
  });
}

// Newsletter
document.addEventListener("DOMContentLoaded", () => {
  const newsletterBtn = document.getElementById("newsletter-btn");
  const newsletterEmail = document.getElementById("newsletter-email");
  const newsletterSuccess = document.getElementById("newsletter-success");

  if (newsletterBtn) {
    newsletterBtn.addEventListener("click", () => {
      const email = newsletterEmail?.value;
      if (!email || !email.includes("@")) {
        alert("Veuillez entrer une adresse email valide");
        return;
      }

      if (newsletterSuccess) {
        newsletterSuccess.classList.add("visible");
      }
      if (newsletterEmail) newsletterEmail.value = "";

      setTimeout(() => {
        if (newsletterSuccess) newsletterSuccess.classList.remove("visible");
      }, 3000);
    });
  }
});

// Contact Form
document.addEventListener("DOMContentLoaded", () => {
  const contactSubmitBtn = document.getElementById("contact-submit-btn");
  const contactSuccess = document.getElementById("contact-success");

  if (contactSubmitBtn) {
    contactSubmitBtn.addEventListener("click", async () => {
      const prenom = document.getElementById("c-prenom")?.value || "";
      const nom = document.getElementById("c-nom")?.value || "";
      const email = document.getElementById("c-email")?.value;
      const telephone = document.getElementById("c-tel")?.value || "";
      const sujet = document.getElementById("c-sujet")?.value || "autre";
      const message = document.getElementById("c-message")?.value;

      if (!email || !message) {
        alert("Veuillez remplir les champs requis (Email et Message)");
        return;
      }

      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prenom,
            nom,
            email,
            telephone,
            sujet,
            message,
          }),
        });

        if (res.ok) {
          if (contactSuccess) {
            contactSuccess.classList.add("visible");
          }
          document.getElementById("c-prenom").value = "";
          document.getElementById("c-nom").value = "";
          document.getElementById("c-email").value = "";
          document.getElementById("c-tel").value = "";
          document.getElementById("c-sujet").value = "";
          document.getElementById("c-message").value = "";

          setTimeout(() => {
            if (contactSuccess) contactSuccess.classList.remove("visible");
          }, 4000);
        }
      } catch (err) {
        alert("Erreur lors de l'envoi du message");
      }
    });
  }
});
