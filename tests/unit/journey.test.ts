import { describe, expect, it } from "vitest";
import {
  addEndingToLedger,
  chooseRouteBranch,
  createJourney,
  resolveCrossing,
  hunt,
  reviveJourney,
  serializeJourney,
  travelToNextLandmark
} from "../../src/journey";

describe("journey", () => {
  it("can travel from departure to arrival with the wagon and at least one traveler alive", () => {
    let journey = createJourney({
      profession: "trader",
      month: "April",
      travelerNames: ["Ada", "Ben", "Clara", "Drew"],
      supplies: {
        food: 780,
        ammunition: 70,
        medicine: 8,
        clothing: 8,
        spareParts: 5,
        money: 45
      }
    });

    while (journey.ending === null) {
      journey = travelToNextLandmark(journey);
    }

    expect(journey.ending.kind).toBe("arrival");
    expect(journey.wagon.integrity).toBeGreaterThan(0);
    expect(journey.travelers.some((traveler) => traveler.alive)).toBe(true);
    expect(journey.score).toBeGreaterThan(0);
  });

  it("lets the party hunt for food while spending ammunition and limiting spoilage", () => {
    const journey = createJourney({
      profession: "scout",
      month: "April",
      travelerNames: ["Ada", "Ben", "Clara", "Drew"],
      supplies: {
        food: 640,
        ammunition: 90,
        medicine: 6,
        clothing: 8,
        spareParts: 5,
        money: 30
      }
    });

    const hunted = hunt(journey, { accuracy: 0.82, shots: 8 });

    expect(hunted.supplies.ammunition).toBe(82);
    expect(hunted.supplies.food).toBe(760);
    expect(hunted.log[0]).toContain("spoiled before it could be packed");
  });

  it("applies route branches and resolves crossings with qualitative risk", () => {
    let journey = createJourney({
      profession: "homesteader",
      month: "March",
      travelerNames: ["Ada", "Ben", "Clara", "Drew"],
      supplies: {
        food: 620,
        ammunition: 50,
        medicine: 5,
        clothing: 7,
        spareParts: 4,
        money: 20
      }
    });

    journey = chooseRouteBranch(journey, "ridge-cutoff");
    journey = travelToNextLandmark(journey);
    journey = resolveCrossing(journey, { method: "ferry", riskRoll: 0.92 });

    expect(journey.activeBranch?.id).toBe("ridge-cutoff");
    expect(journey.supplies.money).toBe(8);
    expect(journey.log[0]).toContain("safe but costly");
    expect(journey.wagon.integrity).toBe(100);
  });

  it("serializes a journey and records endings in the trail ledger", () => {
    let journey = createJourney({
      profession: "trader",
      month: "April",
      travelerNames: ["Ada", "Ben", "Clara", "Drew"],
      supplies: {
        food: 760,
        ammunition: 70,
        medicine: 8,
        clothing: 9,
        spareParts: 6,
        money: 55
      }
    });

    while (journey.ending === null) {
      journey = travelToNextLandmark(journey);
    }

    const revived = reviveJourney(serializeJourney(journey));
    const ledger = addEndingToLedger([], revived);

    expect(revived.ending?.kind).toBe("arrival");
    expect(ledger).toHaveLength(1);
    expect(ledger[0].memorials).toEqual([]);
    expect(ledger[0].score).toBeGreaterThan(0);
  });
});
