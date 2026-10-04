import { expect, test } from "@playwright/test";

test("player can complete a thin departure-to-ending journey", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Leader").fill("Ada");
  await page.getByLabel("Second traveler").fill("Ben");
  await page.getByLabel("Third traveler").fill("Clara");
  await page.getByLabel("Fourth traveler").fill("Drew");
  await page.getByLabel("Profession").selectOption("trader");
  await page.getByRole("button", { name: "Start Journey" }).click();

  await expect(page.getByRole("heading", { name: "Riverbend Landing" })).toBeVisible();
  await page.getByRole("button", { name: "Hunt" }).click();
  await expect(page.getByText(/spoiled before it could be packed/)).toBeVisible();
  await page.getByLabel("Route branch").selectOption("ridge-cutoff");
  await page.getByRole("button", { name: "Travel to Prairie Lantern Fort" }).click();
  await page.getByRole("button", { name: "Hire ferry" }).click();
  await expect(page.getByText(/safe but costly/)).toBeVisible();

  for (let i = 0; i < 4; i += 1) {
    await page.getByRole("button", { name: /Travel to/ }).click();
  }

  await expect(page.getByRole("heading", { name: "Arrival" })).toBeVisible();
  await expect(page.getByText(/Trail Score/)).toBeVisible();
});
