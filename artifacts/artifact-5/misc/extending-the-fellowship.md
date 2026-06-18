# Extending the Fellowship

## Automation (Microsoft Power Automate)

Name: Quest Log of the Fellowship

Trigger: A new Microsoft Forms response. Someone submits a quest through the form.

Outcome: The flow writes the quest to an Excel log in OneDrive and emails the Fellowship member chosen for the quest.

Theme: The form acts as the Fellowship's quest log. Each quest goes to one member: Frodo, Sam, Gandalf, Aragorn, or Legolas.

How it works:

1. When a new response is submitted (Microsoft Forms). The flow starts on every form submission.
2. Get response details. The flow reads the quest name, the assigned member, the priority, and the notes.
3. Add a row into a table. The flow records the quest as a new row in the QuestLog table in OneDrive Excel.
4. Switch on the assigned member. Each case matches one member of the Fellowship. The matching case emails that member the quest details. The Default case catches any other name.

Runs on its own: After setup the flow needs no manual work. Every submission fires it, logs the quest, and emails the right member.

Screenshots:
- Flow diagram: [insert screenshot]
- One row in the Excel quest log: [insert screenshot]
- One quest email: [insert screenshot]

## Low-code game (MakeCode Arcade)

Name: Eldenhobbit: Smaug's Hoard

Link: [paste your MakeCode share link]

A Lord of the Rings parody boss fight. You choose a hero on the start screen, Hobbit for melee or Wizard for ranged, then face Smaug. The dragon holds 500 HP, sweeps the screen with fans of fireballs, and fires telegraphed lasers you dodge by moving off the marked column. At half health Smaug pulls back to the top of the arena. Beat him, climb to the podium, and open the treasure hoard. A timer tracks your run, so a lower time means a better score. Lose all your hearts and the screen reads YOU DIED.

Screenshot:
- Boss fight: [insert screenshot]
