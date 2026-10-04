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

**Food**:
The supply consumed through rations to sustain travelers during trail days.
_Avoid_: Meals, provisions, calories

**Ammunition**:
The supply spent during hunts and sometimes traded or lost during calamities.
_Avoid_: Bullets, ammo, shots

**Medicine**:
The supply used to treat or improve traveler conditions.
_Avoid_: Meds, remedies, first aid

**Clothing**:
The supply that protects travelers from cold, exposure, and weather-related hardship.
_Avoid_: Clothes, garments, gear

**Spare Part**:
A wagon repair supply, such as a wheel, axle, or tongue, used to recover from wagon damage.
_Avoid_: Repair item, component, part

**Money**:
The supply spent for purchases, ferries, trades, and other paid choices.
_Avoid_: Cash, dollars, currency

**Departure**:
The pre-journey setup where the player chooses profession, traveler names, starting month, and starting supplies.
_Avoid_: Setup, character creation, loadout

**Journey Scale**:
The intended real-time duration of a successful journey, long enough for attrition and attachment but short enough to replay after failure.
_Avoid_: Session length, runtime, playtime

**Trail Day**:
The basic unit of journey time, during which travel progress, supply consumption, health changes, weather, and calamities may occur.
_Avoid_: Turn, tick, cycle

**Route**:
The authored sequence of landmarks and route branches that defines where the party can travel during a journey.
_Avoid_: Map, path, graph

**Fictionalized Route**:
An original trail geography that evokes river towns, prairie forts, divide passes, desert springs, mountain gates, and valley endings without claiming exact historical mapping.
_Avoid_: Oregon Trail route, fantasy map, renamed landmarks

**Route Branch**:
A player-selected route alternative with distinct distance, supply, weather, crossing, or calamity risk.
_Avoid_: Fork, alternate path, option

**Landmark**:
A named stop on the route where the party can receive context, trade, rest, make route choices, or face a special decision.
_Avoid_: Node, checkpoint, level

**Calamity**:
An adverse trail event that pressures the party through loss, sickness, injury, delay, damage, or death.
_Avoid_: Random event, bad event, hazard

**Trail Voice**:
Short, concrete, period-flavored prose that remains readable to a modern player and avoids comedy, melodrama, or museum-caption distance.
_Avoid_: Narration, copy, flavor text

**Crossing**:
A river or terrain obstacle where the player chooses a risky method for moving the wagon and party forward.
_Avoid_: Obstacle, river event, traversal challenge

**Crossing Method**:
The player's chosen approach to a crossing, such as fording, caulking, hiring a ferry, or waiting.
_Avoid_: Crossing option, tactic, solution

**Hunt**:
A short action scene where the player spends ammunition and time to gather food.
_Avoid_: Minigame, shooter, forage

**Spoilage**:
The loss of excess hunted food that the wagon cannot preserve or carry forward.
_Avoid_: Waste, decay, rot

**Biome**:
The route environment that shapes hunt scarcity, weather patterns, and some calamity risks.
_Avoid_: Region, terrain type, zone

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

**Risk Signal**:
Qualitative text that tells the player why a choice is safe, dangerous, costly, or uncertain without exposing exact probability math.
_Avoid_: Odds, percentage, warning

**Rest**:
A player choice to spend trail days recovering traveler health or morale while consuming supplies and delaying arrival.
_Avoid_: Sleep, camp, wait

**Repair**:
A wagon recovery action that consumes spare parts or landmark help to address wagon damage.
_Avoid_: Fix, maintenance, mend

**Profession**:
The departure role that shapes starting money, difficulty, scoring expectations, and sometimes special advantages.
_Avoid_: Class, job, archetype

**Homesteader**:
A starting profession defined by tight supply pressure and a straightforward survival challenge.
_Avoid_: Farmer, settler, beginner

**Trader**:
A starting profession defined by money, trade leverage, and stronger purchasing flexibility.
_Avoid_: Merchant, banker, shopkeeper

**Scout**:
A starting profession defined by travel awareness, hunting competence, and route-risk advantages.
_Avoid_: Guide, hunter, ranger

**Trail Scene**:
A canvas-rendered visual scene for travel, landmarks, hunting, crossings, and journey atmosphere.
_Avoid_: View, screen, canvas

**Control Panel**:
A DOM-rendered interface area for departure forms, status, choices, saves, and other precise text or controls.
_Avoid_: UI, dashboard, overlay

**Original Trail Fiction**:
The game's original names, event text, landmark phrasing, and presentation that evoke trail survival without copying Oregon Trail's protected expression.
_Avoid_: Classic text, official names, parody names

**Journey Save**:
The locally stored in-progress journey that lets the player leave and resume the current trip.
_Avoid_: Save file, slot, checkpoint

**Trail Ledger**:
The local record of completed and failed journey endings used for scores, memorials, and player history.
_Avoid_: High scores, stats, achievements

**Memorial Entry**:
A trail ledger record for a traveler death, preserving who died and the circumstance without stopping the journey.
_Avoid_: Obituary, death log, grave marker

**Arrival**:
A successful ending where the wagon and at least one traveler reach the final landmark.
_Avoid_: Win, victory, finish

**Trail Score**:
The ending score based on survivors, remaining supplies, profession difficulty, time, and hardships endured.
_Avoid_: Points, grade, medal

**Ending**:
The resolved outcome of a journey, including arrival, death, abandonment, or other terminal failure.
_Avoid_: Game over, result, finale
