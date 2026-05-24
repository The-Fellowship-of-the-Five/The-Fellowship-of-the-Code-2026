# Reading the Runes – Code Analysis
---

## 1. What the Application Is Supposed to Do

The application is a small rations tracker. The user enters a number into an input field and presses either **Add Rations** to add rations or **Eat Rations** to consume rations. After each interaction, the displayed supply (`Rations available: …`) should show the correct new value.

The code is short (~40 lines) but contains several interconnected bugs around **data types**, **execution order**, and **state consistency**. This exact class of bugs becomes expensive in larger systems — which is why a close look is worthwhile.

---

## 2. Identified Problems

### Problem 1 — Wrong Data Type + Type Switching at Runtime (the actual core bug)

**Where:**
```javascript
let rations = "10";              // initial value is a string
// ...
rations = rations + value;       // in the Add listener
```

**What it is intended to do:**
`rations` should be a number. On *Add*, the entered value should be added mathematically (10 + 8 = 18).

**What actually happens:**
`rations` is a **string** from the start (`"10"`), and `amountInput.value` also always returns a string. For strings, the `+` operator means **concatenation**, not addition. So `"10" + "8"` becomes `"108"`, not `18`. With each click, the string grows further: `"108"` → `"1084"` → …

The subtle, often-overlooked part: the *Eat* listener uses `rations - value`. The `-` operator does **not** exist for strings, so JavaScript automatically converts both values into numbers (type coercion). As a result, `rations = rations - value` suddenly produces a **number**. The type of `rations` therefore depends on **which button was pressed last**:

| Action | Operator | `rations` after | Type |
|---|---|---|---|
| Start | – | `"10"` | string |
| Add 8 | `+` (concatenation) | `"108"` | string |
| Eat 3 | `-` (coercion) | `105` | number |
| Add 8 | `+` (concatenation) | `"1058"` | string |

The variable thus switches uncontrollably back and forth between `string` and `number` — the same code behaves differently depending on its history.

---

### Problem 2 — UI Is Updated Before the State Change (wrong order)

**Where:**
```javascript
eatButton.addEventListener("click", () => {
  const value = amountInput.value;
  updateStatus();                  // ← runs BEFORE rations is changed
  if (rations - value < 0) {
    alert("Not enough rations!");
  } else {
    rations = rations - value;     // the change happens only here
  }
});
```

**What it is intended to do:**
First validate and subtract from the supply, **then** update the display, so the user sees the correct remaining amount.

**What actually happens:**
`updateStatus()` is called at the beginning, i.e. before `rations` is changed at all. The display therefore always shows the **previous** value. If you press *Eat* with 3 (start: 10), the UI still shows `10`, even though `7` would already be correct internally. Only on the **next** click does the display "catch up" to the previous value — the UI always lags one step behind the real state.

In addition, the validation `rations - value < 0` accesses the not-yet-updated value, which compounds the confusion: display, internal state, and validation drift apart.

---

### Problem 3 — Missing Input Validation (follow-up bug)

**Where:** Both listeners take `amountInput.value` directly and unchecked.

**What actually happens:**
With an empty field, `value` is an empty string `""`; with letters (e.g. `"abc"`) it becomes `NaN` as soon as a calculation happens. `NaN` then "infects" every subsequent calculation — `rations` becomes permanently `NaN` and cannot be repaired without reloading the page. Negative inputs are also accepted and invert the meaning of the buttons (eating a negative amount = adding).

---

## 3. Why It Matters

**User experience.** The tracker visibly delivers wrong numbers (`108` instead of `18`) and a display that lags behind the real state. The user makes decisions based on false information and loses trust in the application — for a rations tracker, the correct number is the application's only purpose.

**Later bugs.** The three problems reinforce one another. The type switching (Problem 1) makes the behavior dependent on click history, the wrong order (Problem 2) decouples display and state, and the missing validation (Problem 3) can set the state permanently to `NaN`. Such order-dependent bugs are especially hard to find because they don't occur *every* time, but only with certain click sequences — a classic "works on my machine" bug.

**Risk in a larger system.** This exact pattern — values with an unclear type, state that is changed before validation or displayed too early — is the cause of real, expensive failures: in inventory management it leads to wrong stock levels, in booking systems to double bookings or negative quotas, in financial applications directly to wrong amounts. When UI, internal state, and validation are out of sync, the system can no longer be trusted, and the error propagates into all dependent components (coupling with side effects).

---

## 4. Possible Fixes

- **Store numbers instead of strings:** `let rations = 10;` instead of `"10"`.
- **Convert and validate input:** `const value = Number(amountInput.value);` and validate before calculating with `Number.isNaN(value)` / `value > 0`.
- **Fix the order:** In the *Eat* listener, validate first, then change `rations`, and call `updateStatus()` **afterwards**. This keeps the display always in sync with the real state.
- **Consistent type:** If `rations` is always a `number`, `+` and `-` behave as expected regardless of which button was pressed last.

Corrected core logic:
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
  updateStatus();   // change state first, then display
});
```

---

## 5. AI Reflection

We used AI to walk through the code's behavior line by line and especially to clarify the **"why" questions**: why `+` concatenates strings instead of adding them, and why `-` suddenly converts the same value into a number (type coercion). The most helpful insight was the explanation that the data type of `rations` changes depending on the last button pressed — a connection we had not seen on first reading.

What we had to check critically: an initial explanation reduced the *Eat* bug to merely "`updateStatus()` is in the wrong place" and overlooked the actual core (the type switching and the missing validation). We verified the exact result of the string concatenation (`"10" + "8" = "108"`) and the `NaN` behavior ourselves on the running example, rather than trusting the AI blindly. The decision about which bugs are genuinely "meaningful" in the sense of the assignment, and how we prioritize them, was ours.
