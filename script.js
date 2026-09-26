// --- DATA STRUCTURES (2 Objects / Arrays) ---
// Updated catalog matching your exact menu items
const productsCatalog = [
  { id: 1, name: "Classic Country Sourdough" },
  { id: 2, name: "Whole Wheat Multigrain" },
  { id: 3, name: "Rosemary Focaccia" },
  { id: 4, name: "Butter Croissant" },
  { id: 5, name: "Cinnamon Roll" },
  { id: 6, name: "Seasonal Fruit Tart" }
];

// Array persistent in localStorage
let savedFavorites = JSON.parse(localStorage.getItem("northStarFavs")) || [];

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  initFavoritesFeature();
  initFormValidation();
  prefillFormWithFavorites();
});

// ==========================================
// FEATURE 1: FAVORITES TRACKER & LOCALSTORAGE
// ==========================================
function initFavoritesFeature() {
  renderFavoritesList();

  const favButtons = document.querySelectorAll(".fav-btn");
  favButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const prodId = parseInt(e.target.getAttribute("data-id"));
      addFavorite(prodId);
    });
  });

  const clearBtn = document.getElementById("clear-favs-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearFavorites);
  }
}

function addFavorite(id) {
  const item = productsCatalog.find(p => p.id === id);
  if (!item) return;

  const exists = savedFavorites.some(fav => fav.id === id);
  if (!exists) {
    savedFavorites.push(item);
    saveAndRefreshFavorites();
  } else {
    alert(`${item.name} is already in your saved favorites!`);
  }
}

function removeFavorite(id) {
  savedFavorites = savedFavorites.filter(fav => fav.id !== id);
  saveAndRefreshFavorites();
}

function clearFavorites() {
  savedFavorites = [];
  saveAndRefreshFavorites();
}

function saveAndRefreshFavorites() {
  // Store data in browser localStorage
  localStorage.setItem("northStarFavs", JSON.stringify(savedFavorites));
  renderFavoritesList();
}

function renderFavoritesList() {
  const container = document.getElementById("favorites-list");
  const countSpan = document.getElementById("fav-count");
  if (!container) return;

  if (countSpan) countSpan.textContent = savedFavorites.length;

  if (savedFavorites.length === 0) {
    container.innerHTML = "<p>No favorite items saved yet. Click 'Add to Favorites' next to any menu item!</p>";
    return;
  }

  container.innerHTML = "";
  savedFavorites.forEach(item => {
    const div = document.createElement("div");
    div.className = "fav-item";
    div.innerHTML = `
      <span><strong>${item.name}</strong></span>
      <button onclick="removeFavorite(${item.id})" style="background:none; color:red; border:none; cursor:pointer;">Remove</button>
    `;
    container.appendChild(div);
  });
}

// Prefills the contact form textarea on contact.html using stored browser data
function prefillFormWithFavorites() {
  const detailsField = document.getElementById("details");
  if (detailsField && savedFavorites.length > 0) {
    const favNames = savedFavorites.map(f => f.name).join(", ");
    detailsField.value = `I would like to pre-order my saved favorites: ${favNames}.`;
  }
}

// ==========================================
// FEATURE 2: FORM VALIDATION LOGIC
// ==========================================
function initFormValidation() {
  const form = document.getElementById("bakery-form");
  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    let isValid = true;

    clearErrors();

    // 1. Minimum Length Check (Name >= 2 chars)
    const nameInput = document.getElementById("name");
    if (nameInput && nameInput.value.trim().length < 2) {
      showError("name-error", "Please enter your full name (at least 2 characters).");
      isValid = false;
    }

    // 2. Email Format Check (Regex)
    const emailInput = document.getElementById("email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput && !emailRegex.test(emailInput.value.trim())) {
      showError("email-error", "Please enter a valid email address.");
      isValid = false;
    }

    // 3. Required Field Check (Pickup Date)
    const dateInput = document.getElementById("pickup-date");
    if (dateInput && !dateInput.value) {
      showError("date-error", "Please select a pickup date.");
      isValid = false;
    }

    // 4. Required Selection Check (Request Type)
    const typeSelect = document.getElementById("request-type");
    if (typeSelect && !typeSelect.value) {
      showError("type-error", "Please select a request type.");
      isValid = false;
    }

    // 5. Minimum Length Check (Details >= 5 chars)
    const detailsInput = document.getElementById("details");
    if (detailsInput && detailsInput.value.trim().length < 5) {
      showError("details-error", "Please provide item details or your inquiry (at least 5 characters).");
      isValid = false;
    }

    // If valid, show success message
    if (isValid) {
      const successDiv = document.getElementById("form-success");
      if (successDiv) {
        successDiv.textContent = "Thank you! Your pre-order request has been submitted successfully.";
      }
      form.reset();
    }
  });
}

function showError(elementId, message) {
  const errElement = document.getElementById(elementId);
  if (errElement) errElement.textContent = message;
}

function clearErrors() {
  const errors = document.querySelectorAll(".error-msg");
  errors.forEach(err => err.textContent = "");
  const successDiv = document.getElementById("form-success");
  if (successDiv) successDiv.textContent = "";
}