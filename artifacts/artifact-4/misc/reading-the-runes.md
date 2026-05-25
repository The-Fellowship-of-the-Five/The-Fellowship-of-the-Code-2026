# Reading the Runes – Code Analysis
---

## What the Application Is Supposed to Do

The application is a small rations tracker. The user enters a number into an input field and presses either *Add Rations* to add rations or *Eat Rations* to consume rations.  
After each interaction, the displayed supply **Rations available:** should show the correct new value.

The code is short but contains several bugs around data types, execution order and consistency. This exact class of bugs can become expensive in larger systems.

---

## Identified Problems  

### Problem 1: Wrong Data Type + Type Switching at the click of a button

**Where:**  
`let rations = "10";`

**What it is intended to do:**  
`rations` should be a number. On *Add*, the entered value should be added mathematically (10 + 8 = 18).

**What actually happens:**  
`rations` is a string from the start (**"**10**"**), and amountInput.value also returns a string. For strings, the "+" operator means concatenation, not addition.  
So "10" + "8" becomes "108", instead of 18. With each click, the string grows further.  

Now interestingly the Eat button uses `rations - value`. The "-" operator does not exist for strings, so JavaScript actually converts both values into numbers.  
As a result, `rations = rations - value` suddenly produces a number. The type of `rations` therefore depends on which button was pressed last.  

The variable thus switches uncontrollably back and forth between `string` and `number`, the same code behaves differently depending on its history.

---

### Problem 2: UI Is Updated Before the State Change (wrong order)

**Where:**  
In the Eat listener, `updateStatus()` is called before `rations` is updated.

**What it is intended to do:**  
First validate and subtract from the supply, then update the display, so the user sees the correct remaining amount.

**What actually happens:**  
`updateStatus()` is called at the beginning, before `rations` is changed at all. The display therefore always shows the previous value. If you press Eat with 3 (start: 10), the UI still shows 10, even though 7 would already be correct. Only on the next click does the display catch up to the previous value, so basically the UI always lags one step behind of the real state.

---

## Why It Matters  

**User experience:**  
The tracker visibly delivers wrong numbers (`108` instead of `18`) and a display that lags behind the real state.  
The user makes decisions based on false information and loses trust in the application, for a rations tracker, the correct number is the application's only purpose.  

**Risk in a larger system.**  
This exact pattern, values with an unclear type, state that is changed before validation or displayed too early, can be the cause of real, expensive failures.  
For example in inventory management it leads to wrong stock levels, in booking systems to double bookings or negative quotas, in financial applications directly to wrong amounts. When UI, internal state, and validation are out of sync, the system can no longer be trusted.

---

## Possible Fixes

- Store numbers instead of strings: `let rations = 10;` instead of `"10"`
- Fix the order: In the Eat listener check the supply, then change `rations`, and call `updateStatus()` afterwards. This keeps the display always in sync with the real state.
- Consistent type: If `rations` is always a `number`, `+` and `-` behave as expected regardless of which button was pressed.

---

## AI Reflection

We used AI to walk through the code's behavior line by line and especially to clarify the "why" questions: why "+" concatenates strings instead of adding them, and why "-" suddenly converts the same value into a number.  
The most helpful insight was the explanation that the data type of `rations` changes depending on the last button pressed, a connection we had not seen on first reading.
 
We verified the exact result of the string concatenation (`"10" + "8" = "108"`) ourselves on the running example, rather than trusting the AI blindly.  
The decision about which bugs are genuinely "meaningful" in the sense of the assignment, and how we prioritize them, was ours.
