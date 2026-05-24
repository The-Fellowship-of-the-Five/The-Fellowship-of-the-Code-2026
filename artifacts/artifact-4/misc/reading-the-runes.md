# Reading the Runes – Code Analysis

> Datei: `materials/reading-the-runes.html` · App: *Hobbit Rations Tracker*

## 1. Was die Anwendung tun soll

Die Anwendung ist ein kleiner Vorrats-Tracker. Der Nutzer gibt eine Zahl in ein Eingabefeld ein und drückt entweder **Add Rations**, um Rationen hinzuzufügen, oder **Eat Rations**, um Rationen zu verbrauchen. Nach jeder Interaktion soll der angezeigte Vorrat (`Rations available: …`) den korrekten neuen Wert zeigen.

Der Code ist kurz (~40 Zeilen), enthält aber mehrere zusammenhängende Fehler rund um **Datentypen**, **Ausführungsreihenfolge** und **State-Konsistenz**. Genau diese Klasse von Fehlern wird in größeren Systemen teuer – deshalb lohnt sich der genaue Blick.

---

## 2. Identifizierte Probleme

### Problem 1 — Falscher Datentyp + Typ-Wechsel zur Laufzeit (der eigentliche Kernfehler)

**Wo:**
```javascript
let rations = "10";              // initialer Wert ist ein String
// ...
rations = rations + value;       // im Add-Listener
```

**Was beabsichtigt ist:**
`rations` soll eine Zahl sein. Bei *Add* soll der eingegebene Wert mathematisch addiert werden (10 + 8 = 18).

**Was tatsächlich passiert:**
`rations` ist von Beginn an ein **String** (`"10"`), und `amountInput.value` liefert ebenfalls immer einen String. Der `+`-Operator bedeutet bei Strings **Konkatenation**, nicht Addition. Aus `"10" + "8"` wird also `"108"`, nicht `18`. Mit jedem Klick wächst der String weiter: `"108"` → `"1084"` → …

Der subtile, oft übersehene Teil: Im *Eat*-Listener steht `rations - value`. Der `-`-Operator existiert für Strings **nicht**, also wandelt JavaScript beide Werte automatisch (Type Coercion) in Numbers um. Das Ergebnis von `rations = rations - value` ist dadurch plötzlich ein **Number**. Der Typ von `rations` hängt also davon ab, **welchen Button man zuletzt gedrückt hat**:

| Aktion | Operator | `rations` danach | Typ |
|---|---|---|---|
| Start | – | `"10"` | string |
| Add 8 | `+` (Konkatenation) | `"108"` | string |
| Eat 3 | `-` (Coercion) | `105` | number |
| Add 8 | `+` (Konkatenation) | `"1058"` | string |

Die Variable wechselt also unkontrolliert zwischen `string` und `number` hin und her – derselbe Code verhält sich je nach Vorgeschichte unterschiedlich.

---

### Problem 2 — UI wird vor der Zustandsänderung aktualisiert (falsche Reihenfolge)

**Wo:**
```javascript
eatButton.addEventListener("click", () => {
  const value = amountInput.value;
  updateStatus();                  // ← läuft, BEVOR rations verändert wird
  if (rations - value < 0) {
    alert("Not enough rations!");
  } else {
    rations = rations - value;     // Änderung passiert erst hier
  }
});
```

**Was beabsichtigt ist:**
Erst prüfen und den Vorrat abziehen, **dann** die Anzeige aktualisieren, damit der Nutzer den korrekten Reststand sieht.

**Was tatsächlich passiert:**
`updateStatus()` wird am Anfang aufgerufen, also bevor `rations` überhaupt verändert wurde. Die Anzeige zeigt daher immer den **vorherigen** Stand. Drückt man *Eat* mit 3 (Start: 10), zeigt die UI weiterhin `10` an, obwohl intern bereits `7` korrekt wäre. Erst beim **nächsten** Klick „holt" die Anzeige den vorigen Wert nach – die UI hinkt dem echten Zustand immer einen Schritt hinterher.

Zusätzlich greift die Validierung `rations - value < 0` auf den noch nicht aktualisierten Wert zu, was die Verwirrung verstärkt: Anzeige, interner Zustand und Prüfung laufen auseinander.

---

### Problem 3 — Fehlende Eingabevalidierung (Folgefehler)

**Wo:** Beide Listener nehmen `amountInput.value` direkt und ungeprüft.

**Was tatsächlich passiert:**
Bei leerem Feld ist `value` ein leerer String `""`; bei Buchstaben (z. B. `"abc"`) wird daraus `NaN`, sobald gerechnet wird. `NaN` „infiziert" anschließend jede weitere Rechnung – `rations` wird dauerhaft `NaN` und lässt sich nicht mehr reparieren, ohne die Seite neu zu laden. Auch negative Eingaben werden akzeptiert und kehren die Bedeutung der Buttons um (negativ „essen" = hinzufügen).

---

## 3. Warum das wichtig ist

**Nutzererfahrung.** Der Tracker liefert sichtbar falsche Zahlen (`108` statt `18`) und eine Anzeige, die dem echten Stand hinterherhinkt. Der Nutzer trifft Entscheidungen auf Basis falscher Informationen und verliert das Vertrauen in die Anwendung – bei einem Vorrats-Tracker ist die korrekte Zahl der einzige Zweck der App.

**Spätere Bugs.** Die drei Probleme verstärken sich gegenseitig. Der Typ-Wechsel (Problem 1) macht das Verhalten von der Klick-Historie abhängig, die falsche Reihenfolge (Problem 2) entkoppelt Anzeige und Zustand, und die fehlende Validierung (Problem 3) kann den Zustand dauerhaft auf `NaN` setzen. Solche von der Reihenfolge abhängigen Fehler sind besonders schwer zu finden, weil sie nicht *immer* auftreten, sondern nur bei bestimmten Klick-Abfolgen – ein klassischer „funktioniert bei mir"-Bug.

**Risiko im größeren System.** Genau dieses Muster – Werte mit unklarem Typ, Zustand der vor der Validierung verändert oder zu früh angezeigt wird – ist die Ursache realer, teurer Fehler: in Lagerverwaltung führt es zu falschen Beständen, in Buchungssystemen zu Doppelbuchungen oder negativen Kontingenten, in Finanzanwendungen direkt zu falschen Beträgen. Wenn UI, interner Zustand und Validierung nicht synchron laufen, kann man dem System nicht mehr vertrauen, und der Fehler pflanzt sich in alle abhängigen Komponenten fort (Coupling mit Seiteneffekten).

---

## 4. Mögliche Fixes

- **Zahlen statt Strings speichern:** `let rations = 10;` statt `"10"`.
- **Eingabe konvertieren und prüfen:** `const value = Number(amountInput.value);` und vor der Rechnung mit `Number.isNaN(value)` / `value > 0` validieren.
- **Reihenfolge korrigieren:** Im *Eat*-Listener erst validieren, dann `rations` ändern, **danach** `updateStatus()` aufrufen. So bleibt die Anzeige immer mit dem echten Zustand synchron.
- **Konsistenter Typ:** Wenn `rations` durchgehend ein `number` ist, verhalten sich `+` und `-` immer wie erwartet, unabhängig davon, welcher Button zuletzt gedrückt wurde.

Korrigierte Kernlogik:
```javascript
let rations = 10;

addButton.addEventListener("click", () => {
  const value = Number(amountInput.value);
  if (Number.isNaN(value) || value <= 0) return;
  rations += value;
  updateStatus();
});

eatButton.addEventListener("click", () => {
  const value = Number(amountInput.value);
  if (Number.isNaN(value) || value <= 0) return;
  if (rations - value < 0) {
    alert("Not enough rations!");
    return;
  }
  rations -= value;
  updateStatus();   // erst Zustand ändern, dann anzeigen
});
```

---

## 5. AI-Reflexion

Ich habe die KI genutzt, um das Verhalten des Codes Zeile für Zeile durchzugehen und besonders die **„Warum"-Fragen** zu klären: warum `+` bei Strings konkateniert statt addiert, und warum `-` denselben Wert plötzlich in eine Zahl umwandelt (Type Coercion). Hilfreich war vor allem die Erklärung, dass der Datentyp von `rations` je nach zuletzt gedrücktem Button wechselt – diesen Zusammenhang hatte ich beim ersten Lesen nicht gesehen.

Was ich kritisch prüfen musste: Eine erste Erklärung reduzierte den *Eat*-Fehler nur auf „`updateStatus()` steht an der falschen Stelle" und übersah den eigentlichen Kern (den Typ-Wechsel und die fehlende Validierung). Den genauen Wert der String-Konkatenation (`"10" + "8" = "108"`) und das `NaN`-Verhalten habe ich selbst am laufenden Beispiel überprüft, statt der KI blind zu vertrauen. Die Entscheidung, welche Fehler tatsächlich „bedeutsam" im Sinne der Aufgabenstellung sind und wie ich sie priorisiere, lag bei mir.
