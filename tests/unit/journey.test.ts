import { describe, expect, it } from "vitest";
import { createJourney, travelToNextLandmark } from "../../src/journey";

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
});
