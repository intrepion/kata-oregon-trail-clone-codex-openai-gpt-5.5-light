import { expect, test } from "@playwright/test";
import { pathToFileURL } from "node:url";
import path from "node:path";

for (const entry of ["index.html", "dist/index.html"]) {
  test(`${entry} opens from file protocol`, async ({ page }) => {
    const fileUrl = pathToFileURL(path.resolve(entry)).toString();
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
}
