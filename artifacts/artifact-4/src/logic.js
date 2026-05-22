/* Aufbau dieser Datei:
   1. REZEPTDATEN      – alle verfügbaren Rezepte mit Zutaten
   2. INVENTARDATEN    – vorhandene Vorräte (normal + reduziert)
   3. APP-STATE        – was der Nutzer gerade ausgewählt hat
   4. DOM-HELFER       – kleine Hilfsfunktionen für das HTML
   5. PAGINATION       – dynamische Punkte je nach Modus
   6. INPUTS LESEN     – Formularwerte in den State übernehmen
   7. REZEPT WÄHLEN    – Rezept im State speichern oder löschen
   8. TAB WECHSELN     – aktive Rezeptquelle setzen
   9. UI AKTUALISIEREN – Texte, Tabellen und Screens befüllen
   10. AKTIONEN        – Vergleich, Speichern, Teilen
   11. EVENT LISTENER  – Klicks und Eingaben mit Funktionen verbinden
   12. APP START       – Initialisierung beim Laden der Seite
   */


/* 
   1. REZEPTDATEN
   
   Alle Rezepte sind hier als Objekte gespeichert.

   Felder pro Rezept:
   - name         → Anzeigename 
   - description  → Kurzbeschreibung für die Rezeptkarte
   - overviewText → Noch kürzere Version für die Übersichtsseite
   - requirements → benötigte Mengen in kg pro Zutat
   */
const recipes = {
    "Rabbit Stew": {
        name:         "Rabbit Stew",
        description:  "familiar meal · good for cold travel conditions",
        overviewText: "Warm meal",
        requirements: {
            "Potatoes":    3.0,
            "Rabbit meat": 2.0,
            "Carrots":     1.0,
            "Herbs":       0.1,
            "Salt":        0.05,
            "Water":       1.5
        }
    },
    "Vegetable Soup": {
        name:         "Vegetable Soup",
        description:  "12 servings · low meat use",
        overviewText: "Low meat use",
        requirements: {
            "Potatoes":    2.0,
            "Rabbit meat": 0.0,
            "Carrots":     1.0,
            "Herbs":       0.1,
            "Salt":        0.05,
            "Water":       1.5
        }
    },
    "Travel Bread": {
        name:         "Travel Bread",
        description:  "portable but limited warmth and variety",
        overviewText: "Portable meal",
        requirements: {
            "Potatoes":    6.0,
            "Rabbit meat": 2.0,
            "Carrots":     2.5,
            "Herbs":       0.1,
            "Salt":        0.05,
            "Water":       1.5
        }
    },
    "Dried Meat Stew": {
        name:         "Dried Meat Stew",
        description:  "protein-heavy option",
        overviewText: "Protein-heavy option",
        requirements: {
            "Potatoes":    3.0,
            "Rabbit meat": 4.0,
            "Carrots":     1.0,
            "Herbs":       0.1,
            "Salt":        0.05,
            "Water":       1.5
        }
    }
};


/* 2. INVENTARDATEN
   sharedInventory → normales Vorratslevel (reicht für Rabbit Stew & Vegetable Soup)
*/
const sharedInventory = {
    "Potatoes":    4.5,
    "Rabbit meat": 2.0,
    "Carrots":     1.8,
    "Herbs":       0.2,
    "Salt":        0.3,
    "Water":       2.0
};

/* 3. APP-STATE
  
   Der State ist das "Gedächtnis" der App während einer Sitzung.
   Alle Nutzerentscheidungen werden hier gespeichert und bei
   jedem UI-Update ausgelesen.

   selectedRecipe startet als null → im Single-Modus ist beim
   Öffnen von Screen 3 keine Karte vorausgewählt.
*/
const appState = {
    mode:           null,     // Aktiver Planungsmodus: "single", "multi" oder null (Start)
    source:         "all",    // Aktiver Rezeptquellen-Tab: "all", "saved", "history"
    selectedRecipe: null,     // Name des gewählten Rezepts (null = nichts gewählt)
    people:         9,        // Personenanzahl aus dem Eingabefeld
    days:           3,        // Tagesanzahl aus dem Eingabefeld
    buffer:         1,        // Puffertage aus dem Eingabefeld
    saved:          false,    // Wurde das Rezept gespeichert?
    shared:         false     // Wurde das Rezept geteilt?
};


/* 4. DOM-HELFER
*/

// Gibt ein einzelnes Element zurück (erste Übereinstimmung)
function getElement(selector) {
    return document.querySelector(selector);
}

// Gibt alle passenden Elemente als NodeList zurück
function getElements(selector) {
    return document.querySelectorAll(selector);
}

// Formatiert Zahlen leserlich:
// Ganze Zahlen ohne Nachkommastellen (3 → "3")
// Dezimalzahlen mit zwei Stellen (1.5 → "1.50")
function formatNumber(value) {
    return Number(value)
        .toFixed(value % 1 === 0 ? 0 : 2)
        .replace(/\.00$/, "");
}


/* 5. PAGINATION – dynamische Punkte je nach Modus

   Je nach aktivem Modus werden unterschiedlich viele Punkte
   angezeigt und ein anderer Punkt ist aktiv:

   Start:        0 Punkte  (Modus noch nicht gewählt)
   Single-Flow:  3 Punkte  → History(1) · Overview(2) · Feasibility(3)
   Multi-Flow:   4 Punkte  → Parameters(1) · Select(2) · Overview(3) · Feasibility(4)

   WICHTIG: Die drei Feasibility-Screens (feasibility-ok, feasibility-not,
   feasibility-feedback) werden von beiden Flows genutzt. Da ein JS-Objekt
   keine doppelten Keys erlaubt, stehen sie NICHT in der Map – stattdessen
   liest updatePagination() für diese Screens den aktuellen Modus aus
   appState aus und berechnet die Konfiguration dynamisch.

   Jeder Map-Eintrag definiert:
   - dots:    wie viele Punkte insgesamt angezeigt werden
   - active:  welcher Punkt aktiv ist (0-basierter Index, -1 = keiner)
*/
const screenPaginationMap = {
    "start":            { dots: 0, active: -1 },

    // Single-Flow: 3 Punkte
    "single-history":   { dots: 3, active: 0 },
    "overview-single":  { dots: 3, active: 1 },

    // Multi-Flow: 4 Punkte
    "multi-parameters": { dots: 4, active: 0 },
    "select-recipe":    { dots: 4, active: 1 },
    "overview-multi":   { dots: 4, active: 2 },
};

// Die Feasibility-Screens teilen sich zwischen Single- und Multi-Flow.
// Diese Funktion gibt die richtige Konfiguration je nach aktivem Modus zurück.
const feasibilityScreens = ["feasibility-ok", "feasibility-not", "feasibility-feedback"];

function getFeasibilityConfig() {
    return appState.mode === "single"
        ? { dots: 3, active: 2 }  // Single: letzter von 3 Punkten
        : { dots: 4, active: 3 }; // Multi (oder unbekannt): letzter von 4 Punkten
}

// Aktualisiert die Pagination bei jedem Screen-Wechsel:
// - Bestimmt die Konfiguration (dots + active) für den neuen Screen
// - Baut die Punkte neu auf und setzt .active auf den richtigen
// - Bei 0 Punkten bleibt die Pagination leer (Start-Screen)
function updatePagination(screenName) {
    const pagination = getElement("#main-pagination");

    // Feasibility-Screens: Konfiguration vom Modus abhängig
    // Alle anderen Screens: direkt aus der Map lesen
    const config = feasibilityScreens.includes(screenName)
        ? getFeasibilityConfig()
        : (screenPaginationMap[screenName] ?? { dots: 0, active: -1 });

    pagination.innerHTML = "";

    for (let i = 0; i < config.dots; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (i === config.active) {
            dot.classList.add("active");
        }
        pagination.appendChild(dot);
    }
}

// Wechselt den sichtbaren Screen und aktualisiert die Pagination:
// - Entfernt .active-screen von allen Screens
// - Fügt .active-screen nur dem gewünschten Screen hinzu
// - Ruft updatePagination() auf, damit die Punkte stimmen
// - Blendet modusspezifische Buttons ein oder aus
// - Setzt den Quelltitel auf Screen 3 korrekt, da das Element
//   beim App-Start noch nicht sichtbar ist und setRecipeSource()
//   den Text daher nicht setzen kann
// - Screens werden über data-screen="name" identifiziert
function showScreen(screenName) {
    getElements(".screen").forEach(function (screen) {
        screen.classList.remove("active-screen");
    });

    const target = getElement(`[data-screen="${screenName}"]`);
    if (target) {
        target.classList.add("active-screen");
    }

    // "Adjust servings / days" nur im Multi-Modus anzeigen.
    // Im Single-Modus oder auf dem Start-Screen ist dieser Button nicht relevant.
    const btnAdjust = getElement("#btn-adjust-servings");
    if (btnAdjust) {
        btnAdjust.classList.toggle("hidden", appState.mode !== "multi");
    }

    // Quelltitel auf Screen 3 beim Wechsel aktualisieren,
    // damit er immer mit dem aktiven Tab übereinstimmt.
    if (screenName === "single-history") {
        const title = getElement("#single-source-title");
        if (title) {
            title.textContent = appState.source.charAt(0).toUpperCase() + appState.source.slice(1);
        }
    }

    updatePagination(screenName);
}


/* 6. INPUTS LESEN
   Liest die aktuellen Werte aus den drei Zahleneingabefeldern
   und schreibt sie in den App-State.
   Wird bei jeder Nutzeraktion aufgerufen, bevor die UI updatet.
   */
function updateStateFromInputs() {
    // Single meal: fester Plan für 1 Person, 1 Tag, kein Puffer.
    // Die Multi-Eingaben werden im Single-Modus bewusst ignoriert.
    if (appState.mode === "single") {
        appState.people = 1;
        appState.days   = 1;
        appState.buffer = 0;
        return;
    }

    appState.people = Number(getElement("#people").value) || 1;
    appState.days   = Number(getElement("#days").value)   || 1;
    appState.buffer = Number(getElement("#buffer").value) || 0;
}

/* 7. REZEPT WÄHLEN
   
   Speichert das gewählte Rezept im State.
   Es gibt keine visuelle Markierung auf den Karten mehr –
   die Auswahl wirkt sich nur auf die Übersicht und den
   Machbarkeits-Check aus.

   Wird null übergeben → Auswahl im State zurücksetzen.
   */
function setSelectedRecipe(recipeName) {

    // Kein Rezept übergeben → Auswahl im State zurücksetzen
    if (!recipeName) {
        appState.selectedRecipe = null;
        return;
    }

    // Unbekanntes Rezept → abbrechen, um Fehler zu vermeiden
    if (!recipes[recipeName]) {
        return;
    }

    // State aktualisieren – die Auswahl wird intern gespeichert,
    // aber visuell nicht mehr auf den Karten angezeigt.
    appState.selectedRecipe = recipeName;
}


/* 8. TAB WECHSELN
   Setzt den aktiven Rezeptquellen-Tab (Browse all / Saved / History)
   und speichert die Auswahl im State.
   Aktiver Tab bekommt die Klasse .active.
   Im Single-Modus wird zusätzlich die Überschrift der Rezeptliste
   aktualisiert, damit sie dem gewählten Tab entspricht.
   */
function setRecipeSource(sourceName) {
    appState.source = sourceName;

    getElements("[data-source]").forEach(function (tab) {
        tab.classList.toggle("active", tab.dataset.source === sourceName);
    });

    // Überschrift der Rezeptliste im Single-Modus aktualisieren.
    // if (title) verhindert einen Fehler, falls das Element nicht sichtbar ist.
    const title = getElement("#single-source-title");
    if (title) title.textContent = sourceName.charAt(0).toUpperCase() + sourceName.slice(1);
}


/* 9. UI AKTUALISIEREN
   Diese Funktionen lesen den aktuellen State und schreiben die
   Werte in die richtigen HTML-Elemente (über ihre IDs).
   */

// Aktualisiert den Filtertext auf Screen 4 (Select Recipe)
function updateFilterText() {
    getElement("#filter-text").textContent =
        `Filtered: People: ${appState.people} | Days: ${appState.days} | Buffer: ${appState.buffer} | ${appState.source} recipes`;
}

// Aktualisiert die Übersichtskarten auf Screen 5 (Multi) und Screen 6 (Single)
function updateOverview() {
    const recipe = recipes[appState.selectedRecipe];

    // Kein Rezept gewählt → nichts zu aktualisieren
    if (!recipe) return;

    // Multi-Übersicht (Screen 5)
    getElement("#overview-source").textContent            = appState.source;
    getElement("#overview-multi-title").textContent       = recipe.name;
    getElement("#overview-multi-description").textContent = `${recipe.overviewText} · suitable for ${appState.people} people`;
    getElement("#overview-servings").textContent          = appState.people;
    getElement("#overview-days").textContent              = appState.days;
    getElement("#overview-buffer").textContent            = appState.buffer;

    // Single-Übersicht (Screen 6)
    getElement("#overview-single-source").textContent      = appState.source;
    getElement("#overview-single-title").textContent       = recipe.name;
    getElement("#overview-single-description").textContent = `${recipe.overviewText} · suitable for 1 person`;
}

// Berechnet die Differenz zwischen benötigten und vorhandenen Zutaten.
// Gibt ein Array mit Zeilen-Objekten zurück (Grundlage für die Tabellen).
function calculateComparison(inventory) {
    const recipe = recipes[appState.selectedRecipe];

    // Die Rezeptmengen sind für den Standardplan kalibriert:
    // 9 Personen über 3 Tage + 1 Puffertag.
    const BASE_PEOPLE = 9;
    const BASE_DAYS   = 3 + 1;            // days + buffer

    // Plan-Faktor: skaliert die Mengen proportional zu Personen UND Plandauer.
    // 9 Personen / 4 Tage  → Faktor 1 (= Ausgangsmengen).
    // doppelt so viele Personen → doppelte Menge.
    const planFactor =
        (appState.people * (appState.days + appState.buffer)) /
        (BASE_PEOPLE * BASE_DAYS);

    return Object.keys(recipe.requirements).map(function (ingredient) {
        const required   = recipe.requirements[ingredient] * planFactor;
        const available  = inventory[ingredient] || 0;
        const difference = available - required;

        return {
            ingredient: ingredient,
            required:   required,
            available:  available,
            left:       Math.max(difference, 0),   // Überschuss (min. 0)
            missing:    Math.max(-difference, 0)   // Fehlmenge (min. 0)
        };
    });
}

// Füllt einen Tabellen-tbody mit berechneten Vergleichsdaten.
// tableSelector  → CSS-Selektor des tbody-Elements
// rows           → Array aus calculateComparison()
// resultType     → "missing" = rote Fehlmenge | "left" = grüner Überschuss
function renderTable(tableSelector, rows, resultType) {
    const tbody = getElement(tableSelector);
    tbody.innerHTML = "";

    rows.forEach(function (row) {
        const tr          = document.createElement("tr");
        const resultValue = resultType === "missing" ? row.missing : row.left;
        const resultClass = resultType === "missing" && resultValue > 0
            ? "missing-value"
            : "positive-value";

        tr.innerHTML = `
            <td>${row.ingredient}</td>
            <td>${formatNumber(row.required)}</td>
            <td>${formatNumber(row.available)}</td>
            <td class="${resultClass}">${formatNumber(resultValue)}</td>
        `;

        tbody.appendChild(tr);
    });
}

// Aktualisiert alle drei Machbarkeits-Screens (7, 8, 9) auf einmal:
// dynamische Texte, Tabellen und Bestätigungsmeldungen.
function updateFeasibilityScreens() {
    const recipe      = recipes[appState.selectedRecipe];
    const rows  = calculateComparison(sharedInventory);
   
    // Dynamische Texte
    getElement("#not-feasible-text").textContent =
        `${recipe.name} can not be prepared for ${appState.people} people over ${appState.days} days without changes or additional supplies.`;

    getElement("#feasible-text").textContent          = `${recipe.name} can be prepared with the current shared supplies.`;
    getElement("#feedback-feasible-text").textContent = `${recipe.name} can be prepared with the current shared supplies.`;

    getElement("#enough-for-text").textContent          = `Enough for: ${appState.people} people`;
    getElement("#feedback-enough-for-text").textContent = `Enough for: ${appState.people} people`;

    getElement("#plan-basis-text").textContent          = `Plan basis: ${appState.days} days + ${appState.buffer} buffer`;
    getElement("#feedback-plan-basis-text").textContent = `Plan basis: ${appState.days} days + ${appState.buffer} buffer`;

    // Tabellen befüllen
    renderTable("#missing-table-body",       rows, "missing");
    renderTable("#left-table-body",          rows,  "left");
    renderTable("#feedback-left-table-body", rows,  "left");

    // Bestätigungsmeldungen: .visible = sichtbar, ohne = versteckt
    getElement("#saved-message").classList.toggle("visible", appState.saved);
    getElement("#shared-message").classList.toggle("visible", appState.shared);
}

// Kombinierter Update-Aufruf: liest Inputs und aktualisiert alle UI-Bereiche.
// Machbarkeits-Screens werden nur aktualisiert, wenn ein Rezept gewählt ist.
function updateWholeInterface() {
    updateStateFromInputs();
    updateFilterText();
    updateOverview();

    if (appState.selectedRecipe) {
        updateFeasibilityScreens();
    }
}


/* 
   10. AKTIONEN
   Reaktionen auf konkrete Nutzeraktionen (Buttons mit data-action).
 */

// VERGLEICH: Prüft Machbarkeit und wechselt zum passenden Screen.
// feasible = true → grüner Screen | false → roter Screen
// saved und shared werden zurückgesetzt, damit beim nächsten
// Rezept keine alten Bestätigungsmeldungen erscheinen.
function compareRequirementAndInventory() {
    if (!appState.selectedRecipe) return;

    appState.saved  = false;
    appState.shared = false;

    updateWholeInterface();

    const rows = calculateComparison(sharedInventory);
    const isFeasible = rows.every(function (row) { return row.missing === 0; });
    showScreen(isFeasible ? "feasibility-ok" : "feasibility-not");
}

// ANDERES REZEPT WÄHLEN: Navigiert je nach Modus zum richtigen Screen.
// Single-Modus → zurück zur History (Screen 3)
// Multi-Modus  → zur Rezeptauswahl (Screen 4)
function pickDifferentRecipe() {
    showScreen(appState.mode === "single" ? "single-history" : "select-recipe");
}

// SPEICHERN: Setzt saved = true und wechselt zum Feedback-Screen
function saveRecipe() {
    appState.saved = true;
    updateFeasibilityScreens();
    showScreen("feasibility-feedback");
}

// TEILEN: Setzt shared = true und wechselt zum Feedback-Screen
function shareRecipe() {
    appState.shared = true;
    updateFeasibilityScreens();
    showScreen("feasibility-feedback");
}


/* 11. EVENT LISTENER
   Verbindet HTML-Elemente mit den JavaScript-Funktionen.
   Alle Interaktionen laufen über data-Attribute:

   data-go      → Screen-Name, zu dem navigiert wird
   data-mode    → Planungsmodus ("single" oder "multi")
   data-recipe  → Rezeptname, der ausgewählt werden soll
   data-source  → Rezeptquellen-Tab ("all", "saved", "history")
   data-action  → Aktion ("compare", "pick-different", "save", "share")
   data-reset   → "recipes" = Rezeptauswahl beim Navigieren zurücksetzen
   */
function registerEventListeners() {

    // NAVIGATIONS-BUTTONS (data-go): wechseln Screen, optional auch Modus/Rezept
    getElements("[data-go]").forEach(function (button) {
        button.addEventListener("click", function () {

            // Beim Navigieren zum Start-Screen: Modus zurücksetzen,
            // damit kein alter Modus aus einer vorherigen Session hängenbleibt.
            if (button.dataset.go === "start") {
                appState.mode = null;
            }

            // Modus setzen, falls vorhanden
            if (button.dataset.mode) {
                appState.mode = button.dataset.mode;

                // Im Single-Modus: Rezeptauswahl zurücksetzen,
                // damit Screen 3 ohne Vorauswahl erscheint
                if (button.dataset.mode === "single") {
                    setSelectedRecipe(null);
                }
            }

            // Rezeptauswahl zurücksetzen, falls data-reset="recipes" gesetzt ist.
            // Wird beim Zurück-Button auf der Single-Übersicht verwendet.
            if (button.dataset.reset === "recipes") {
                appState.selectedRecipe = null;
            }

            // Rezept auswählen, falls angegeben (z.B. auf Screen 3 und 4)
            if (button.dataset.recipe) {
                setSelectedRecipe(button.dataset.recipe);
            }

            updateWholeInterface();
            showScreen(button.dataset.go);
        });
    });

    // TAB-BUTTONS (data-source): wechseln die Rezeptquelle
    getElements("[data-source]").forEach(function (tab) {
        tab.addEventListener("click", function () {
            setRecipeSource(tab.dataset.source);
            updateWholeInterface();
        });
    });

    // ZAHLENEINGABEN: jede Änderung aktualisiert sofort die Oberfläche
    getElements("input[type='number']").forEach(function (input) {
        input.addEventListener("input", updateWholeInterface);
    });

    // AKTIONS-BUTTONS (data-action): Vergleich, anderes Rezept, Speichern, Teilen
    getElements("[data-action]").forEach(function (button) {
        button.addEventListener("click", function () {
            const action = button.dataset.action;

            if (action === "compare")       { compareRequirementAndInventory(); }
            if (action === "pick-different") { pickDifferentRecipe(); }
            if (action === "save")           { saveRecipe(); }
            if (action === "share")          { shareRecipe(); }
        });
    });
}


/* 12. APP START
   
   Sobald das gesamte HTML geladen ist, wird die App initialisiert:
   - Event Listener registrieren
   - Standard-Tab aktivieren
   - Texte und Zahlen initial setzen
   - Start-Screen anzeigen (setzt auch die Pagination auf 0 Punkte)

   selectedRecipe bleibt null → im Single-Modus ist beim ersten
   Öffnen von Screen 3 keine Karte vormarkiert.
*/
document.addEventListener("DOMContentLoaded", function () {
    registerEventListeners();
    setRecipeSource(appState.source);
    updateWholeInterface();
    showScreen("start");
});
