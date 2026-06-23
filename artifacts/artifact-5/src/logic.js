/* =========================================================
   ZUSTAND (State)
   Lebt nur im Speicher (Array), kein Backend, kein localStorage.
   ========================================================= */
let inventory = [
  { name: "Milk", quantity: 1, unit: "l" },
  { name: "Onions", quantity: 3, unit: "pcs" },
  { name: "Pasta", quantity: 1, unit: "pks" },
  { name: "Rice", quantity: 500, unit: "g" },
  { name: "Tomatoes", quantity: 4, unit: "pcs" },
];

// Zutaten, die in der aktuellen "Add Ingredients"-Runde gesammelt,
// aber noch nicht bestätigt wurden.
let pendingItems = [];

// Namen der Zutaten, die gerade frisch bestätigt wurden.
// Werden nur angezeigt, solange man auf dem Inventory-Screen bleibt
// (siehe clearRecentlyAdded()).
let recentlyAddedNames = [];

const UNITS = ["pcs", "pks", "g", "kg", "l", "ml"];

/* =========================================================
   HILFSFUNKTIONEN
   ========================================================= */

// Sucht ein Item per Name, Groß-/Kleinschreibung egal.
function findItem(name) {
  return inventory.find((item) => item.name.toLowerCase() === name.toLowerCase());
}

// Zeigt genau einen Screen, versteckt alle anderen.
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => screen.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

// "Recently Added" zurücksetzen -> Items rutschen wieder normal in die Hauptliste.
function clearRecentlyAdded() {
  recentlyAddedNames = [];
}

function unitOptionsHTML(selected) {
  return UNITS.map(
    (unit) => `<option value="${unit}" ${unit === selected ? "selected" : ""}>${unit}</option>`
  ).join("");
}

// Entfernt beim Tippen alles, was kein Buchstabe ist (auch Umlaute erlaubt).
function lettersOnly(value) {
  return value.replace(/[^\p{L}]/gu, "");
}

// Schneidet alles ab der zweiten Nachkommastelle ab (max. 1 Dezimalstelle).
// Eine echte Null wird erst beim Bestätigen (Add/Save) abgelehnt, nicht schon
// beim Tippen - sonst könnte man "0" als ersten Tastendruck von "0.1" nie eingeben.
function oneDecimalOnly(value) {
  const match = value.match(/^\d*\.?\d?/);
  return match ? match[0] : value;
}

/* =========================================================
   FUZZY-SUCHE (Extension: Fuse.js)
   Verbindet sich mit den bereits vorhandenen "Search Inventory"-Feldern
   und ersetzt die bisher funktionslose Suche durch echtes,
   tippfehler-tolerantes Filtern.
   ========================================================= */
function attachFuzzySearch(inputId, items, renderRow, targetElement) {
  const input = document.getElementById(inputId);
  const fuse = new Fuse(items, { keys: ["name"], threshold: 0.4 });

  input.value = "";
  input.oninput = () => {
    const query = input.value.trim();
    const results = query ? fuse.search(query).map((result) => result.item) : items;
    targetElement.innerHTML = results.map(renderRow).join("");
  };
}

/* =========================================================
   SCREEN: SHARED INVENTORY (Hauptliste)
   ========================================================= */
function itemRowHTML(item, isNew) {
  return `<li class="item-row">
    <span class="item-name">${item.name}${isNew ? ' <span class="badge">new</span>' : ""}</span>
    <span class="item-qty">${item.quantity} ${item.unit}</span>
  </li>`;
}

function renderInventoryScreen() {
  // Falls ein Item über das Adjust-Modal gelöscht wurde, darf es hier nicht mehr auftauchen.
  recentlyAddedNames = recentlyAddedNames.filter((addedName) => findItem(addedName));

  const banner = document.getElementById("banner-updated");
  const recentSection = document.getElementById("recently-added-section");
  const recentList = document.getElementById("recently-added-list");
  const mainList = document.getElementById("inventory-list");

  // Recently-Added-Bereich nur zeigen, wenn gerade ein Update bestätigt wurde.
  if (recentlyAddedNames.length > 0) {
    banner.textContent = `Inventory updated · ${recentlyAddedNames.length} Items added`;
    banner.classList.remove("hidden");
    recentSection.classList.remove("hidden");
    recentList.innerHTML = recentlyAddedNames
      .map((name) => itemRowHTML(findItem(name), true))
      .join("");
  } else {
    banner.classList.add("hidden");
    recentSection.classList.add("hidden");
    recentList.innerHTML = "";
  }

  // Hauptliste: alle Items außer den gerade frisch hinzugefügten, alphabetisch sortiert.
  const visibleItems = inventory
    .filter((item) => !recentlyAddedNames.some((addedName) => addedName.toLowerCase() === item.name.toLowerCase()))
    .sort((itemA, itemB) => itemA.name.localeCompare(itemB.name));

  mainList.innerHTML = visibleItems.map((item) => itemRowHTML(item, false)).join("");
  attachFuzzySearch("search-main", visibleItems, (item) => itemRowHTML(item, false), mainList);
}

/* =========================================================
   SCREEN: ADD INGREDIENTS
   ========================================================= */
function renderPendingList() {
  const list = document.getElementById("pending-list");
  list.innerHTML = pendingItems
    .map(
      (item, index) => `<li class="item-row pending-row">
        <span class="item-name">${item.name}</span>
        <span class="item-qty">${item.quantity} ${item.unit}</span>
        <button class="remove-btn" data-index="${index}">✕</button>
      </li>`
    )
    .join("");
}

// Fuse-Index über die aktuellen Inventory-Namen, für das Produktname-Dropdown.
let nameFuse = null;
function setupNameAutocomplete() {
  nameFuse = new Fuse(inventory, { keys: ["name"], threshold: 0.4 });
}

// Zeigt passende Inventory-Namen unter dem Feld an - exakt wie die Fuzzy-Suche
// bei "Search Inventory", nur als klickbare Vorschlagsliste statt Live-Filter.
function showNameSuggestions(query) {
  const list = document.getElementById("name-suggestions");
  const matches = query ? nameFuse.search(query).map((result) => result.item) : [];
  if (matches.length === 0) {
    list.classList.add("hidden");
    list.innerHTML = "";
    return;
  }
  list.innerHTML = matches.map((item) => `<li data-name="${item.name}">${item.name}</li>`).join("");
  list.classList.remove("hidden");
}

// Existiert der eingegebene Name schon im Inventory, darf nur noch dessen
// bereits gespeicherte Einheit gewählt werden (keine Mischmengen pro Produkt).
function applyUnitLock(name) {
  const inputUnit = document.getElementById("input-unit");
  const existingItem = findItem(name);
  if (existingItem) {
    inputUnit.innerHTML = `<option value="${existingItem.unit}" selected>${existingItem.unit}</option>`;
    inputUnit.disabled = true;
  } else {
    inputUnit.innerHTML = unitOptionsHTML("pcs");
    inputUnit.disabled = false;
  }
}

// Wendet eine Filter-Funktion auf ein Feld an, weist den Wert aber NUR neu zu,
// wenn er sich wirklich ändert. Wichtig bei type="number": eine Zuweisung auf
// denselben Wert lässt den Browser mitten beim Tippen den Dezimalpunkt verschlucken.
function sanitizeInput(input, filterFn) {
  const fixed = filterFn(input.value);
  if (fixed !== input.value) input.value = fixed;
}

const inputName = document.getElementById("input-name");
const inputQuantity = document.getElementById("input-quantity");
const nameSuggestions = document.getElementById("name-suggestions");

// Buchstaben filtern, Vorschläge aktualisieren und prüfen, ob die Einheit
// auf einen bestehenden Inventory-Eintrag gesperrt werden muss.
inputName.addEventListener("input", () => {
  sanitizeInput(inputName, lettersOnly);
  showNameSuggestions(inputName.value.trim());
  applyUnitLock(inputName.value.trim());
});

// Klick auf einen Vorschlag übernimmt den exakten Namen und sperrt die Einheit.
nameSuggestions.addEventListener("click", (event) => {
  if (event.target.tagName !== "LI") return;
  inputName.value = event.target.dataset.name;
  nameSuggestions.classList.add("hidden");
  applyUnitLock(inputName.value);
});

// Dropdown schließen, sobald irgendwo außerhalb geklickt wird.
document.addEventListener("click", (event) => {
  if (!document.querySelector(".autocomplete-wrap").contains(event.target)) {
    nameSuggestions.classList.add("hidden");
  }
});

inputQuantity.addEventListener("input", () => sanitizeInput(inputQuantity, oneDecimalOnly));

document.getElementById("button-add-to-pending-list").onclick = () => {
  const inputUnit = document.getElementById("input-unit");

  const name = inputName.value.trim();
  const quantity = parseFloat(inputQuantity.value);

  if (!name || !quantity || quantity <= 0) {
    alert("Garstige leere Felder! Wir wollen PO-TA-TOES! (Oder zumindest irgendeine Zutat... bitte zuerst etwas eintragen");
    return;
  }

  pendingItems.push({ name, quantity, unit: inputUnit.value });
  renderPendingList();

  // Formular für die nächste Eingabe leeren.
  inputName.value = "";
  inputQuantity.value = "";
  applyUnitLock(""); // Einheit wieder frei wählbar für den nächsten Eintrag
};

// Klick auf das ✕ einer Pending-Zeile entfernt genau diese Zutat wieder.
document.getElementById("pending-list").addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-btn")) {
    pendingItems.splice(Number(event.target.dataset.index), 1);
    renderPendingList();
  }
});

/* =========================================================
   SCREEN: REVIEW ITEMS
   ========================================================= */
function renderReviewScreen() {
  const body = document.getElementById("review-body");
  body.innerHTML = pendingItems
    .map((item) => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>${item.unit}</td></tr>`)
    .join("");
}

document.getElementById("button-to-review-items").onclick = () => {
  if (pendingItems.length === 0) {
    alert("Wir verhungern, mein Schatz! Garstige leere Listen... Gib uns wenigstens einen saftigen, zappelnden Fisch (oder trage eine Zutat ein), bevor du überprüfst!)");
    return;
  }
  renderReviewScreen();
  showScreen("screen-review");
};

document.getElementById("button-edit-ingredients").onclick = () => {
  // Entwurf bleibt erhalten, nur der Screen wechselt zurück.
  showScreen("screen-add");
};

// Bestätigtes Update in das Shared Inventory einspielen.
document.getElementById("button-confirm-update").onclick = () => {
  pendingItems.forEach((pendingItem) => {
    const existingItem = findItem(pendingItem.name);
    if (existingItem) {
      existingItem.quantity += pendingItem.quantity; // gleiche Einheit wird angenommen
    } else {
      inventory.push({ ...pendingItem });
    }
    recentlyAddedNames.push(pendingItem.name);
  });

  pendingItems = [];
  showScreen("screen-inventory");
  renderInventoryScreen();
};

/* =========================================================
   ADJUST-MODAL: bestehende Mengen direkt überschreiben
   ========================================================= */
// data-name hält den URSPRÜNGLICHEN Namen fest, damit das Item beim Speichern
// wiedergefunden wird, auch wenn der Name gerade umbenannt wird.
function adjustRowHTML(item) {
  return `<tr data-name="${item.name}">
    <td><input type="text" class="adjust-name" value="${item.name}"></td>
    <td><input type="number" min="0.1" step="0.1" class="adjust-qty" value="${item.quantity}"></td>
    <td><select class="adjust-unit">${unitOptionsHTML(item.unit)}</select></td>
    <td><button class="remove-btn" data-delete>✕</button></td>
  </tr>`;
}

function renderAdjustModal() {
  const body = document.getElementById("adjust-body");
  const sortedItems = [...inventory].sort((itemA, itemB) => itemA.name.localeCompare(itemB.name));
  body.innerHTML = sortedItems.map(adjustRowHTML).join("");
  attachFuzzySearch("search-modal", sortedItems, adjustRowHTML, body);
}

const adjustBody = document.getElementById("adjust-body");

// Event-Delegation: wirkt auch auf Zeilen, die nach einer Fuse.js-Suche neu eingefügt wurden.
adjustBody.addEventListener("input", (event) => {
  if (event.target.classList.contains("adjust-name")) sanitizeInput(event.target, lettersOnly);
  if (event.target.classList.contains("adjust-qty")) sanitizeInput(event.target, oneDecimalOnly);
});

// Klick auf das ✕ neben Unit löscht das Produkt sofort komplett aus dem Inventory.
adjustBody.addEventListener("click", (event) => {
  if (!event.target.hasAttribute("data-delete")) return;
  const name = event.target.closest("tr").dataset.name;
  if (confirm(`Bist du sicher? Pippin würde weinen, wenn "${name}" einfach so verschwindet!`)) {
    inventory = inventory.filter((item) => item.name !== name);
    renderAdjustModal();
  }
});

document.getElementById("button-adjust").onclick = () => {
  renderAdjustModal();
  document.getElementById("modal-adjust").classList.remove("hidden");
};

document.getElementById("button-close-adjust-modal").onclick = () => {
  document.getElementById("modal-adjust").classList.add("hidden");
  renderInventoryScreen(); // falls über das X bereits etwas gelöscht wurde
};

// Speichert nur die Zeilen, die aktuell im Modal sichtbar sind
// (von der Suche ausgefilterte Items bleiben unverändert).
document.getElementById("button-save-changes").onclick = () => {
  const rows = document.querySelectorAll("#adjust-body tr");

  // Vor dem Speichern prüfen: kein leerer Name, keine Menge <= 0.
  for (const row of rows) {
    const name = row.querySelector(".adjust-name").value.trim();
    const quantity = parseFloat(row.querySelector(".adjust-qty").value);
    if (!name || !quantity || quantity <= 0) {
      alert("Sprich Freund und tritt ein... oder füll zumindest alle Pflichtfelder aus! Mit leeren Feldern lässts sich nicht arbeiten!");
      return;
    }
  }

  rows.forEach((row) => {
    const existingItem = findItem(row.dataset.name); // ursprünglicher Name zum Wiederfinden
    if (!existingItem) return;
    existingItem.name = row.querySelector(".adjust-name").value.trim();
    existingItem.quantity = parseFloat(row.querySelector(".adjust-qty").value);
    existingItem.unit = row.querySelector(".adjust-unit").value;
  });

  document.getElementById("modal-adjust").classList.add("hidden");
  renderInventoryScreen();
};

/* =========================================================
   NAVIGATION
   ========================================================= */

// Home -> Meal Planning ist nicht Teil dieses Artifacts, daher nur ein Hinweis.
document.getElementById("button-meal-planning").onclick = () => {
  alert("Man plant nicht einfach so ein Essen in Mordor... (Diese Funktion ist in der aktuellen Version leider noch nicht verfügbar)");
};

// Home -> Shared Inventory
document.getElementById("button-to-shared-inventory").onclick = () => {
  clearRecentlyAdded();
  renderInventoryScreen();
  showScreen("screen-inventory");
};

// Generische "Back"-Buttons mit data-nav (Inventory -> Home, Review -> Add).
document.querySelectorAll("[data-nav]").forEach((button) => {
  button.onclick = () => {
    const targetScreenId = button.dataset.nav;
    if (targetScreenId === "screen-home") clearRecentlyAdded();
    showScreen(targetScreenId);
  };
});

// Inventory -> Add Ingredients (neue, frische Update-Runde starten).
document.getElementById("button-start-add-ingredients").onclick = () => {
  clearRecentlyAdded();
  pendingItems = [];
  renderPendingList();
  setupNameAutocomplete();
  applyUnitLock("");
  showScreen("screen-add");
};

// Add Ingredients -> Back: Entwurf wird verworfen.
document.getElementById("button-cancel-add-ingredients").onclick = () => {
  pendingItems = [];
  renderInventoryScreen();
  showScreen("screen-inventory");
};
