# Oregon Trail-Inspired Trail Survival Game

This context defines the player-facing survival journey language for a browser game inspired by Oregon Trail. The game uses original names, writing, and presentation while preserving the recognizable structure of a party traveling west through resource pressure, landmarks, calamities, hunting, crossings, and endings.

## Language

**Journey**:
A single playable trip from departure to an ending, tracking the party, wagon, supplies, route progress, hardship, and final outcome.
_Avoid_: Run, campaign, save

**Party**:
The group of named travelers whose health, morale, and survival determine the emotional stakes of the journey.
_Avoid_: Crew, team, units

**Traveler**:
One member of the party, represented as a person who can become sick, injured, recover, die, or reach the destination.
_Avoid_: Character, pawn, unit

**Wagon**:
The party's mobile home and cargo system during the journey.
_Avoid_: Vehicle, inventory container, cart

**Supply**:
A consumable or tradeable resource carried by the wagon, such as food, ammunition, medicine, clothing, spare parts, or money.
_Avoid_: Item, good, asset

**Departure**:
The pre-journey setup where the player chooses profession, traveler names, starting month, and starting supplies.
_Avoid_: Setup, character creation, loadout

**Trail Day**:
The basic unit of journey time, during which travel progress, supply consumption, health changes, weather, and calamities may occur.
_Avoid_: Turn, tick, cycle

**Route**:
The authored sequence of landmarks and route branches that defines where the party can travel during a journey.
_Avoid_: Map, path, graph

**Route Branch**:
A player-selected route alternative with distinct distance, supply, weather, crossing, or calamity risk.
_Avoid_: Fork, alternate path, option

**Landmark**:
A named stop on the route where the party can receive context, trade, rest, make route choices, or face a special decision.
_Avoid_: Node, checkpoint, level

**Calamity**:
An adverse trail event that pressures the party through loss, sickness, injury, delay, damage, or death.
_Avoid_: Random event, bad event, hazard

**Crossing**:
A river or terrain obstacle where the player chooses a risky method for moving the wagon and party forward.
_Avoid_: Obstacle, river event, traversal challenge

**Hunt**:
A short action scene where the player spends ammunition and time to gather food.
_Avoid_: Minigame, shooter, forage

**Health**:
A traveler's visible physical condition, affected by rations, pace, weather, sickness, injury, rest, and medicine.
_Avoid_: Hit points, life, stamina

**Morale**:
A traveler's visible emotional condition, affected by hardship, hunger, death, rest, successful hunts, and landmark outcomes.
_Avoid_: Happiness, sanity, mood

**Condition**:
A named traveler affliction or injury that can worsen, improve, consume medicine, slow travel, or contribute to death.
_Avoid_: Status effect, debuff, ailment

**Pace**:
The player's chosen travel intensity, trading faster progress for higher strain on travelers, animals, and supplies.
_Avoid_: Speed, difficulty, movement rate

**Rations**:
The player's chosen food distribution level, trading supply conservation against traveler health and morale.
_Avoid_: Food setting, meals, diet

**Profession**:
The departure role that shapes starting money, difficulty, scoring expectations, and sometimes special advantages.
_Avoid_: Class, job, archetype

**Journey Save**:
The locally stored in-progress journey that lets the player leave and resume the current trip.
_Avoid_: Save file, slot, checkpoint

**Trail Ledger**:
The local record of completed and failed journey endings used for scores, memorials, and player history.
_Avoid_: High scores, stats, achievements

**Ending**:
The resolved outcome of a journey, including arrival, death, abandonment, or other terminal failure.
_Avoid_: Game over, result, finale
