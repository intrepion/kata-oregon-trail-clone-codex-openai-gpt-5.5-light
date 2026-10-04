import { expect, test } from "@playwright/test";
import { pathToFileURL } from "node:url";
import path from "node:path";

test("packaged build opens from file protocol", async ({ page }) => {
  const fileUrl = pathToFileURL(path.resolve("dist/index.html")).toString();
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(fileUrl);

  await expect(page.getByRole("button", { name: "Start Journey" })).toBeVisible();
  expect(errors).toEqual([]);
});
