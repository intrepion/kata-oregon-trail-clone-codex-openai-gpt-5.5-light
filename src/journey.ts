export type Profession = "homesteader" | "trader" | "scout";
export type Month = "March" | "April" | "May";
export type Pace = "steady" | "hard";
export type Rations = "meager" | "fair" | "full";

export type Supplies = {
  food: number;
  ammunition: number;
  medicine: number;
  clothing: number;
  spareParts: number;
  money: number;
};

export type Traveler = {
  name: string;
  health: number;
  morale: number;
  alive: boolean;
  conditions: string[];
};

export type Wagon = {
  integrity: number;
};

export type Landmark = {
  id: string;
  name: string;
  milesFromStart: number;
  biome: string;
  text: string;
};

export type RouteBranch = {
  id: "valley-road" | "ridge-cutoff";
  name: string;
  distanceModifier: number;
  risk: string;
};

export type Ending = {
  kind: "arrival" | "failure";
  title: string;
  summary: string;
};

export type Journey = {
  profession: Profession;
  month: Month;
  trailDay: number;
  miles: number;
  landmarkIndex: number;
  travelers: Traveler[];
  wagon: Wagon;
  supplies: Supplies;
  pace: Pace;
  rations: Rations;
  activeBranch: RouteBranch | null;
  crossingResolved: boolean;
  log: string[];
  ending: Ending | null;
  score: number;
};

export type CrossingMethod = "ford" | "caulk" | "ferry" | "wait";
export type CrossingAttempt = {
  method: CrossingMethod;
  riskRoll: number;
};

export type HuntAttempt = {
  accuracy: number;
  shots: number;
};

export type Departure = {
  profession: Profession;
  month: Month;
  travelerNames: string[];
  supplies: Supplies;
};

export const route: Landmark[] = [
  {
    id: "riverbend",
    name: "Riverbend Landing",
    milesFromStart: 0,
    biome: "river town",
    text: "The river is brown with snowmelt. Wagons crowd the bank, waiting for dry roads."
  },
  {
    id: "prairie-fort",
    name: "Prairie Lantern Fort",
    milesFromStart: 120,
    biome: "prairie",
    text: "Lanterns burn late over the stockade. Traders know which wheels broke on the west road."
  },
  {
    id: "divide-pass",
    name: "Ash Divide Pass",
    milesFromStart: 285,
    biome: "high plains",
    text: "Wind combs the grass flat. The pass ahead looks narrow enough to scrape the sky."
  },
  {
    id: "desert-spring",
    name: "Mercy Spring",
    milesFromStart: 420,
    biome: "dry basin",
    text: "A cold spring threads through alkali dust. Everyone drinks before speaking."
  },
  {
    id: "mountain-gate",
    name: "Needle Gate",
    milesFromStart: 585,
    biome: "mountain",
    text: "Pines crowd the slope. Snow still sleeps in the shaded gullies."
  },
  {
    id: "valley-end",
    name: "Willowglass Valley",
    milesFromStart: 720,
    biome: "valley",
    text: "Green fields open below the ridge. The wagon groans, but the valley is real."
  }
];

export const routeBranches: RouteBranch[] = [
  {
    id: "valley-road",
    name: "Valley Road",
    distanceModifier: 1,
    risk: "longer but settled"
  },
  {
    id: "ridge-cutoff",
    name: "Ridge Cutoff",
    distanceModifier: 0.82,
    risk: "shorter but exposed"
  }
];

const professionSupplies: Record<Profession, Supplies> = {
  homesteader: { food: 620, ammunition: 50, medicine: 5, clothing: 7, spareParts: 4, money: 20 },
  trader: { food: 760, ammunition: 70, medicine: 8, clothing: 9, spareParts: 6, money: 55 },
  scout: { food: 680, ammunition: 90, medicine: 6, clothing: 8, spareParts: 5, money: 30 }
};

export function suppliesForProfession(profession: Profession): Supplies {
  return { ...professionSupplies[profession] };
}

export function createJourney(departure: Departure): Journey {
  const names = departure.travelerNames
    .map((name) => name.trim())
    .filter(Boolean)
    .slice(0, 4);
  while (names.length < 4) {
    names.push(`Traveler ${names.length + 1}`);
  }

  return {
    profession: departure.profession,
    month: departure.month,
    trailDay: 1,
    miles: 0,
    landmarkIndex: 0,
    travelers: names.map((name) => ({
      name,
      health: 100,
      morale: 82,
      alive: true,
      conditions: []
    })),
    wagon: { integrity: 100 },
    supplies: { ...departure.supplies },
    pace: "steady",
    rations: "fair",
    activeBranch: routeBranches[0],
    crossingResolved: false,
    log: [`Departed Riverbend Landing in ${departure.month}.`],
    ending: null,
    score: 0
  };
}

export function currentLandmark(journey: Journey): Landmark {
  return route[journey.landmarkIndex];
}

export function nextLandmark(journey: Journey): Landmark | null {
  return route[journey.landmarkIndex + 1] ?? null;
}

export function travelToNextLandmark(journey: Journey): Journey {
  if (journey.ending) {
    return journey;
  }
  const target = nextLandmark(journey);
  if (!target) {
    return finishJourney(journey);
  }

  const distance = (target.milesFromStart - journey.miles) * (journey.activeBranch?.distanceModifier ?? 1);
  const days = Math.max(2, Math.ceil(distance / (journey.pace === "hard" ? 24 : 18)));
  const foodUsed = days * livingTravelers(journey).length * rationAmount(journey.rations);
  const hardship = hardshipFor(journey, target, days);
  const updatedTravelers = journey.travelers.map((traveler, index) =>
    applyHardship(traveler, hardship + (index % 2), foodUsed > journey.supplies.food)
  );
  const updated: Journey = {
    ...journey,
    trailDay: journey.trailDay + days,
    miles: target.milesFromStart,
    landmarkIndex: journey.landmarkIndex + 1,
    travelers: updatedTravelers,
    wagon: { integrity: Math.max(1, journey.wagon.integrity - Math.max(0, hardship - 4)) },
    supplies: {
      ...journey.supplies,
      food: Math.max(0, journey.supplies.food - foodUsed)
    },
    log: [
      `${days} trail days to ${target.name}. ${target.text}`,
      ...journey.log
    ]
  };

  if (!updated.travelers.some((traveler) => traveler.alive) || updated.wagon.integrity <= 0) {
    return {
      ...updated,
      ending: {
        kind: "failure",
        title: "Trail Lost",
        summary: "The wagon could not carry the party any farther."
      },
      score: 0
    };
  }

  if (updated.landmarkIndex === route.length - 1) {
    return finishJourney(updated);
  }

  return updated;
}

export function chooseRouteBranch(journey: Journey, branchId: RouteBranch["id"]): Journey {
  const branch = routeBranches.find((candidate) => candidate.id === branchId) ?? routeBranches[0];
  return {
    ...journey,
    activeBranch: branch,
    log: [`Route set to ${branch.name}: ${branch.risk}.`, ...journey.log]
  };
}

export function resolveCrossing(journey: Journey, attempt: CrossingAttempt): Journey {
  if (journey.ending || journey.crossingResolved) {
    return journey;
  }
  const method = crossingProfile(attempt.method);
  const risk = Math.max(0.05, method.baseRisk - (journey.profession === "scout" ? 0.08 : 0));
  const failed = attempt.riskRoll < risk;
  const money = Math.max(0, journey.supplies.money - method.cost);
  const wagonLoss = failed ? method.wagonLoss : 0;
  const message = failed
    ? `${method.label} turned dangerous. The wagon took damage in the crossing.`
    : `${method.label} proved ${method.signal}.`;
  return {
    ...journey,
    crossingResolved: true,
    wagon: {
      integrity: Math.max(1, journey.wagon.integrity - wagonLoss)
    },
    supplies: {
      ...journey.supplies,
      money
    },
    log: [message, ...journey.log]
  };
}

export function hunt(journey: Journey, attempt: HuntAttempt): Journey {
  if (journey.ending) {
    return journey;
  }
  const shots = Math.max(0, Math.min(Math.floor(attempt.shots), journey.supplies.ammunition));
  if (shots === 0) {
    return {
      ...journey,
      log: ["No ammunition remained for the hunt.", ...journey.log]
    };
  }
  const biome = currentLandmark(journey).biome;
  const scarcity = biome.includes("dry") || biome.includes("mountain") ? 0.72 : 1;
  const profession = journey.profession === "scout" ? 1.12 : journey.profession === "homesteader" ? 0.9 : 1;
  const accuracy = Math.max(0, Math.min(1, attempt.accuracy));
  const gathered = Math.floor(shots * accuracy * 20 * scarcity * profession);
  const carried = Math.min(gathered, 120);
  const spoiled = Math.max(0, gathered - carried);
  const result = spoiled > 0
    ? `The hunt brought in ${gathered} pounds, but ${spoiled} spoiled before it could be packed.`
    : `The hunt brought in ${carried} pounds of food.`;
  return {
    ...journey,
    trailDay: journey.trailDay + 1,
    supplies: {
      ...journey.supplies,
      ammunition: journey.supplies.ammunition - shots,
      food: journey.supplies.food + carried
    },
    log: [result, ...journey.log]
  };
}

function finishJourney(journey: Journey): Journey {
  const survivors = livingTravelers(journey).length;
  const arrived = journey.wagon.integrity > 0 && survivors > 0;
  return {
    ...journey,
    ending: {
      kind: arrived ? "arrival" : "failure",
      title: arrived ? "Arrival" : "Trail Lost",
      summary: arrived
        ? `${survivors} traveler${survivors === 1 ? "" : "s"} reached Willowglass Valley with the wagon.`
        : "The journey ended before the valley."
    },
    score: arrived ? scoreJourney(journey) : 0
  };
}

function crossingProfile(method: CrossingMethod): { label: string; signal: string; baseRisk: number; cost: number; wagonLoss: number } {
  if (method === "ferry") {
    return { label: "Hiring the ferry", signal: "safe but costly", baseRisk: 0.04, cost: 12, wagonLoss: 8 };
  }
  if (method === "wait") {
    return { label: "Waiting for lower water", signal: "slow but safer", baseRisk: 0.08, cost: 0, wagonLoss: 10 };
  }
  if (method === "caulk") {
    return { label: "Caulking the wagon", signal: "uncertain in the current", baseRisk: 0.24, cost: 0, wagonLoss: 28 };
  }
  return { label: "Fording the river", signal: "quick but dangerous", baseRisk: 0.34, cost: 0, wagonLoss: 36 };
}

function scoreJourney(journey: Journey): number {
  const survivors = livingTravelers(journey).length;
  const supplyScore = Math.floor(journey.supplies.food / 8) + journey.supplies.medicine * 5 + journey.supplies.spareParts * 8;
  const professionBonus = journey.profession === "homesteader" ? 180 : journey.profession === "scout" ? 90 : 40;
  const timeBonus = Math.max(0, 220 - journey.trailDay * 2);
  return survivors * 250 + supplyScore + professionBonus + timeBonus + journey.wagon.integrity;
}

function livingTravelers(journey: Journey): Traveler[] {
  return journey.travelers.filter((traveler) => traveler.alive);
}

function rationAmount(rations: Rations): number {
  if (rations === "meager") return 1.4;
  if (rations === "full") return 2.6;
  return 2;
}

function hardshipFor(journey: Journey, landmark: Landmark, days: number): number {
  const season = journey.month === "March" ? 2 : journey.month === "May" ? 1 : 0;
  const biome = landmark.biome.includes("mountain") || landmark.biome.includes("dry") ? 3 : 1;
  const pace = journey.pace === "hard" ? 2 : 0;
  const food = journey.supplies.food < days * 6 ? 3 : 0;
  return season + biome + pace + food;
}

function applyHardship(traveler: Traveler, hardship: number, hungry: boolean): Traveler {
  if (!traveler.alive) {
    return traveler;
  }
  const healthLoss = hardship + (hungry ? 8 : 0);
  const moraleLoss = Math.ceil(hardship / 2) + (hungry ? 5 : 0);
  const health = Math.max(0, traveler.health - healthLoss);
  const morale = Math.max(0, traveler.morale - moraleLoss);
  const conditions = [...traveler.conditions];
  if (health < 55 && conditions.length === 0) {
    conditions.push("trail fever");
  }
  return {
    ...traveler,
    health,
    morale,
    alive: health > 0,
    conditions
  };
}
