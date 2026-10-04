import { describe, expect, it } from "vitest";
import { createJourney, hunt, travelToNextLandmark } from "../../src/journey";

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
});
