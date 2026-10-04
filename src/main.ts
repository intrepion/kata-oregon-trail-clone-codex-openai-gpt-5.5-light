import "./styles.css";
import {
  createJourney,
  chooseRouteBranch,
  currentLandmark,
  nextLandmark,
  resolveCrossing,
  route,
  routeBranches,
  suppliesForProfession,
  hunt,
  travelToNextLandmark,
  type Journey,
  type Month,
  type Profession
} from "./journey";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Missing app root");
}

const root = app;
let journey: Journey | null = null;

renderDeparture();

function renderDeparture(): void {
  root.innerHTML = `
    <main class="shell">
      <section class="scene-wrap" aria-label="Trail scene">
        <canvas id="trail-scene" width="960" height="540"></canvas>
      </section>
      <section class="panel" aria-label="Control panel">
        <p class="eyebrow">Trailward</p>
        <h1>Prepare the wagon</h1>
        <form id="departure-form" class="stack">
          <label>Leader <input name="traveler0" value="Ada" /></label>
          <label>Second traveler <input name="traveler1" value="Ben" /></label>
          <label>Third traveler <input name="traveler2" value="Clara" /></label>
          <label>Fourth traveler <input name="traveler3" value="Drew" /></label>
          <label>Profession
            <select name="profession">
              <option value="homesteader">Homesteader</option>
              <option value="trader" selected>Trader</option>
              <option value="scout">Scout</option>
            </select>
          </label>
          <label>Starting month
            <select name="month">
              <option value="March">March</option>
              <option value="April" selected>April</option>
              <option value="May">May</option>
            </select>
          </label>
          <button type="submit">Start Journey</button>
        </form>
      </section>
    </main>
  `;
  drawOpeningScene();
  document.querySelector<HTMLFormElement>("#departure-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    if (!(formElement instanceof HTMLFormElement)) {
      return;
    }
    const form = new FormData(formElement);
    const profession = form.get("profession") as Profession;
    const month = form.get("month") as Month;
    journey = createJourney({
      profession,
      month,
      travelerNames: [0, 1, 2, 3].map((index) => String(form.get(`traveler${index}`) ?? "")),
      supplies: suppliesForProfession(profession)
    });
    renderJourney();
  });
}

function renderJourney(): void {
  if (!journey) {
    renderDeparture();
    return;
  }

  const landmark = currentLandmark(journey);
  const target = nextLandmark(journey);
  const atCrossing = journey.landmarkIndex === 1 && !journey.crossingResolved;
  const travelerRows = journey.travelers
    .map(
      (traveler) => `
        <li class="${traveler.alive ? "" : "lost"}">
          <strong>${traveler.name}</strong>
          <span>Health ${traveler.health}</span>
          <span>Morale ${traveler.morale}</span>
          <em>${traveler.alive ? traveler.conditions.join(", ") || "steady" : "lost"}</em>
        </li>`
    )
    .join("");
  const ending = journey.ending;

  root.innerHTML = `
    <main class="shell">
      <section class="scene-wrap" aria-label="Trail scene">
        <canvas id="trail-scene" width="960" height="540"></canvas>
      </section>
      <section class="panel" aria-label="Control panel">
        <p class="eyebrow">Day ${journey.trailDay} · ${journey.miles} miles</p>
        <h1>${ending ? ending.title : landmark.name}</h1>
        <p class="voice">${ending ? ending.summary : landmark.text}</p>
        <dl class="supplies">
          <div><dt>Food</dt><dd>${Math.floor(journey.supplies.food)}</dd></div>
          <div><dt>Ammunition</dt><dd>${journey.supplies.ammunition}</dd></div>
          <div><dt>Medicine</dt><dd>${journey.supplies.medicine}</dd></div>
          <div><dt>Clothing</dt><dd>${journey.supplies.clothing}</dd></div>
          <div><dt>Parts</dt><dd>${journey.supplies.spareParts}</dd></div>
          <div><dt>Money</dt><dd>${journey.supplies.money}</dd></div>
        </dl>
        <ul class="travelers">${travelerRows}</ul>
        ${
          ending
            ? `<p class="score">Trail Score ${journey.score}</p><button id="new-journey">New Journey</button>`
            : `
              ${journey.landmarkIndex === 0 ? branchControl(journey) : ""}
              <div class="actions">
                <button id="hunt">Hunt</button>
                ${atCrossing ? `<button id="ferry">Hire ferry</button>` : `<button id="travel">${target ? `Travel to ${target.name}` : "Finish Journey"}</button>`}
              </div>
            `
        }
        <ol class="log">${journey.log.slice(0, 4).map((entry) => `<li>${entry}</li>`).join("")}</ol>
      </section>
    </main>
  `;

  drawJourneyScene(journey);
  document.querySelector<HTMLButtonElement>("#travel")?.addEventListener("click", () => {
    journey = travelToNextLandmark(journey as Journey);
    renderJourney();
  });
  document.querySelector<HTMLButtonElement>("#hunt")?.addEventListener("click", () => {
    journey = hunt(journey as Journey, { accuracy: 0.82, shots: 8 });
    renderJourney();
  });
  document.querySelector<HTMLSelectElement>("#route-branch")?.addEventListener("change", (event) => {
    const select = event.currentTarget;
    if (!(select instanceof HTMLSelectElement)) {
      return;
    }
    journey = chooseRouteBranch(journey as Journey, select.value as "valley-road" | "ridge-cutoff");
    renderJourney();
  });
  document.querySelector<HTMLButtonElement>("#ferry")?.addEventListener("click", () => {
    journey = resolveCrossing(journey as Journey, { method: "ferry", riskRoll: 0.92 });
    renderJourney();
  });
  document.querySelector<HTMLButtonElement>("#new-journey")?.addEventListener("click", () => {
    journey = null;
    renderDeparture();
  });
}

function branchControl(activeJourney: Journey): string {
  return `
    <label>Route branch
      <select id="route-branch">
        ${routeBranches
          .map(
            (branch) =>
              `<option value="${branch.id}" ${activeJourney.activeBranch?.id === branch.id ? "selected" : ""}>${branch.name} - ${branch.risk}</option>`
          )
          .join("")}
      </select>
    </label>
  `;
}

function drawOpeningScene(): void {
  const canvas = document.querySelector<HTMLCanvasElement>("#trail-scene");
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;
  drawSky(ctx, canvas);
  drawGround(ctx, canvas);
  drawWagon(ctx, 330, 335);
  drawRiver(ctx, canvas);
}

function drawJourneyScene(activeJourney: Journey): void {
  const canvas = document.querySelector<HTMLCanvasElement>("#trail-scene");
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;
  const progress = activeJourney.miles / route[route.length - 1].milesFromStart;
  drawSky(ctx, canvas);
  drawGround(ctx, canvas);
  drawRoad(ctx, canvas, progress);
  drawWagon(ctx, 150 + progress * 610, 338 - Math.sin(progress * Math.PI) * 45);
  ctx.fillStyle = "#26323a";
  ctx.font = "24px Georgia, serif";
  ctx.fillText(currentLandmark(activeJourney).name, 44, 64);
}

function drawSky(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#93b8c8");
  gradient.addColorStop(0.62, "#e7d9b7");
  gradient.addColorStop(1, "#806f4f");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f6eed2";
  ctx.beginPath();
  ctx.arc(760, 92, 46, 0, Math.PI * 2);
  ctx.fill();
}

function drawGround(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
  ctx.fillStyle = "#887448";
  ctx.fillRect(0, 350, canvas.width, canvas.height - 350);
  ctx.fillStyle = "#5a6b46";
  ctx.beginPath();
  ctx.moveTo(0, 350);
  ctx.lineTo(180, 240);
  ctx.lineTo(330, 350);
  ctx.lineTo(0, 350);
  ctx.fill();
  ctx.fillStyle = "#6f7651";
  ctx.beginPath();
  ctx.moveTo(290, 350);
  ctx.lineTo(530, 190);
  ctx.lineTo(790, 350);
  ctx.lineTo(290, 350);
  ctx.fill();
}

function drawRoad(ctx: CanvasRenderingContext2D, _canvas: HTMLCanvasElement, progress: number): void {
  ctx.strokeStyle = "#d7c08e";
  ctx.lineWidth = 22;
  ctx.beginPath();
  ctx.moveTo(20, 500);
  ctx.bezierCurveTo(250, 410, 360, 460, 520, 380);
  ctx.bezierCurveTo(650, 315, 710, 395, 930, 300);
  ctx.stroke();
  ctx.fillStyle = "#26323a";
  ctx.fillRect(90, 478, Math.max(24, progress * 760), 8);
}

function drawRiver(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
  ctx.fillStyle = "rgba(53, 113, 130, 0.85)";
  ctx.beginPath();
  ctx.moveTo(0, 430);
  ctx.bezierCurveTo(260, 380, 420, 530, canvas.width, 450);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.fill();
}

function drawWagon(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = "#3e2f24";
  ctx.fillRect(x, y, 118, 42);
  ctx.fillStyle = "#ede1c6";
  ctx.beginPath();
  ctx.ellipse(x + 58, y + 4, 62, 45, Math.PI, 0, Math.PI);
  ctx.fill();
  ctx.strokeStyle = "#3e2f24";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = "#211812";
  ctx.beginPath();
  ctx.arc(x + 24, y + 45, 16, 0, Math.PI * 2);
  ctx.arc(x + 92, y + 45, 16, 0, Math.PI * 2);
  ctx.fill();
}
