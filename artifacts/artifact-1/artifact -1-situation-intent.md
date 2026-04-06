Situation  

The Fellowship is in the early to middle stages of their journey and are travelling through the wilderness with long and harsh paths and no guaranteed access to fresh supplies and the constant threat of ambush. One core problem is the chaos of having nine companions with nine backpacks, all with different contents and capacity and no shared overview. Nobody knows who carries what, how much is left of what or how many days and who already picked up or traded for something. To track this manually (“WHO STILL GOT EGGS?!”) is slow, could contain human (or other species of course)-error and would be very loud, which can be dangerous in some situations, where silence defines life or death. The group also could obtain something twice or none at all, when they are out for supply gathering, which would result in wasted time and gold. Also threat information is prone to stay with the person who found the threat, which is often because the group is spread out and the environment and dangers change often. One missing item, or one danger alert less could jeopardize the entire mission to get to Mount Doom to safe middle earth. 

Intent  

The primary users are all members of the Fellowship, with a special focus on the quartermaster’s role (Sam). The app should allow every member to quietly keep track of their own inventory while still providing a shared overview for the whole group. The quartermaster should be able to plan meals based on the ingredients the group currently has, estimate how long the supplies will last, and create accurate shopping lists for the next resupply opportunity. Besides food management, the system should also help the group identify nearby markets, warn about possible threats, and coordinate tasks. The app does not make decisions for the group, does not fully replace communication between members and is not meant to be a combat or chat tool. Instead, it simply provides the information the Fellowship needs to make better decisions.  

Value  

The Fellowship Companion helps them to manage food better, pack more efficiently, and stay aware of what is going on. The quartermaster doesn’t need to ask all members what they are carrying when meals must be planned. It also helps the group avoid buying the same things twice or carrying unnecessary weight. The system also, makes it easier to notice resupply options and possible dangers earlier. On top of that, tasks stay visible, so its clearer who is responsible for what. Without this system the group could realize too late that important supplies are missing, waste gold on duplicates, overload smaller members, miss nearby markets, or walk into dangerous areas that someone already knew about but forgot to mention, or simply could not, since they where not together at that time. 

System Capabilities 

Inventory Tracking: Each member of the fellowship logs their own items. The system then synchronizes everything into a shared group inventory, which will be visible to everyone. 

Recipe-Based deficit calculation: One member selects a meal or sets parameters (for example: “feed nine people for 3 days with one additional extra day”). The system compares requirements vs. the available pooled inventory and shows exactly what is missing and in what quantity. 

Predictive Shopping – example: Lists: Based on current deficits and upcoming meal plans, the system generates a shopping list. When a member is near a location that has the needed items, they get notified. The fellowship also gets a warning when someone is about to buy something the group already has enough of. 

Intelligent Load Distribution: The system suggests how to divide new purchases among members based on individual carrying capacities (a Hobbit carries less than a Dwarf). This prevents unfair or inefficient weight distribution. 

Shared threat & location map: A group map showing markets, allies and the fellowship’s positions and user-reported dangers. Members approaching a reported threat gets warned, old reports are flagged as less reliable over time. 

Critical alert system: Urgent notifications (for example: “no healing herbs left” / “orc camp on planned route”) are visually and functionally distinct from routine updates, so critical information does not get buried. 

Task Tracker: Members can create, assign and complete tasks. The group sees what is open, what is done and whether something failed – with space to note effort or issues. 

Assumptions & Constraints 

Data Quality is dependent on the User: The App only knows of data that the members of the Fellowship input. If nobody reports a threat or updates their inventory, the data will be incomplete or wrong. The System is entirely dependent on active and honest participation.  

The App assumes Honesty: There is no verification of Data. If someone logs items, they don’t have or fail to log items at all, then the system can produce harmful misinformation. Which ends up making the situation worse than no system at all.  

Carrying Capacity: Each member of has a carrying limit. The system must take this into consideration when suggesting purchases and item distribution. A Hobbit cannot carry what a Dwarf can.  

Decaying Data: The Location from a threat from multiple days ago may no longer be correct. The System or User should treat older reports as less reliable. 

“Magical” synchronization is assumed: The App needs to sync in between members automatically, even when separated.  
