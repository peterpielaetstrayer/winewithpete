(() => {
  "use strict";

  const STORAGE_KEY = "wwp-table-lab-v01";
  const makeEmpty = () => ({
    memory: "",
    memorable: [],
    focus: "",
    intention: "",
    offering: "",
    food: "",
    atmosphere: [],
    guests: "",
    time: "",
    welcome: "",
    participation: "",
    pacing: "",
    fallback: "",
    afterward: ""
  });

  let state = makeEmpty();
  let activeStep = 0;

  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    if (stored && typeof stored === "object" && !Array.isArray(stored)) {
      const fresh = makeEmpty();
      for (const field of Object.keys(fresh)) {
        const value = stored[field];
        if (Array.isArray(fresh[field]) && Array.isArray(value)) {
          fresh[field] = value.filter(item => typeof item === "string").slice(0, 12);
        } else if (typeof fresh[field] === "string" && typeof value === "string") {
          fresh[field] = value.slice(0, 5000);
        }
      }
      state = fresh;
    }
  } catch (_) {
    // The guide remains usable when storage is disabled.
  }

  const el = id => document.getElementById(id);
  const asText = (value, fallback) => (typeof value === "string" && value.trim() ? value.trim() : fallback);
  const readableList = items => items.length ? items.join(" · ") : "";

  function saveState() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {
      // Browser-local persistence is an enhancement, not a requirement.
    }
  }

  function renderScore() {
    el("score-memory").textContent = asText(state.memory, "Your remembered table will appear here.");
    if (state.memorable.length) {
      el("score-memory").textContent += `\nWhat mattered: ${readableList(state.memorable)}`;
    }

    el("score-focus").textContent = asText(state.focus, "Your starting point will appear here.");
    el("score-intention").textContent = state.intention ? `Hoping to: ${state.intention.trim()}` : "";
    el("score-offering").textContent = asText(state.offering, "Your personal touch will appear here.");
    el("score-food").textContent = state.food ? `Food and drink: ${state.food.trim()}` : "";

    const people = [];
    if (state.guests) people.push(`Guests: ${state.guests.trim()}`);
    if (state.time) people.push(`When: ${state.time.trim()}`);
    if (state.atmosphere.length) people.push(`Feeling: ${readableList(state.atmosphere)}`);
    el("score-people").textContent = people.length ? people.join("\n") : "Your guests and atmosphere will appear here.";
    el("score-welcome").textContent = state.welcome ? `Welcome: ${state.welcome.trim()}` : "";
    el("score-participation").textContent = state.participation ? `Participation: ${state.participation}` : "";
    el("score-pacing").textContent = asText(state.pacing, "Your evening's rhythm will appear here.");
    el("score-fallback").textContent = state.fallback ? `If plans change: ${state.fallback.trim()}` : "";
    el("score-afterward").textContent = asText(state.afterward, "A space to return to after the gathering.");
  }

  function renderInputs() {
    for (const input of document.querySelectorAll("[data-field]")) {
      input.value = state[input.dataset.field] || "";
    }
    for (const choice of document.querySelectorAll("[data-choice-group]")) {
      const field = choice.dataset.choiceGroup;
      const selected = choice.dataset.multi === "true"
        ? state[field].includes(choice.dataset.choice)
        : state[field] === choice.dataset.choice;
      choice.classList.toggle("is-selected", selected);
      choice.setAttribute("aria-pressed", String(selected));
    }
  }

  function showStep(nextIndex, { moveFocus = true } = {}) {
    activeStep = Math.max(0, Math.min(4, nextIndex));
    for (const section of document.querySelectorAll(".lesson-step")) {
      section.hidden = Number(section.dataset.step) !== activeStep;
    }
    for (const button of document.querySelectorAll("[data-step-nav]")) {
      const index = Number(button.dataset.stepNav);
      const isActive = index === activeStep;
      button.classList.toggle("is-active", isActive);
      button.classList.toggle("is-visited", index < activeStep);
      if (isActive) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    }
    el("stepProgress").style.width = `${(activeStep + 1) * 20}%`;
    if (moveFocus) {
      const heading = document.querySelector(`[data-step="${activeStep}"] h3`);
      const panel = document.querySelector(".lesson-panel");
      panel.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      if (heading) heading.focus({ preventScroll: true });
    }
  }

  function buildScoreText() {
    const values = [
      ["A TABLE I REMEMBER", [state.memory, state.memorable.length ? `What mattered: ${readableList(state.memorable)}` : ""].filter(Boolean).join("\n")],
      ["THE REASON", [state.focus, state.intention].filter(Boolean).join("\n")],
      ["MY OFFERING", [state.offering, state.food ? `Food and drink: ${state.food}` : ""].filter(Boolean).join("\n")],
      ["PEOPLE & ATMOSPHERE", [state.guests ? `Guests: ${state.guests}` : "", state.time ? `When: ${state.time}` : "", state.atmosphere.length ? `Feeling: ${readableList(state.atmosphere)}` : ""].filter(Boolean).join("\n")],
      ["WELCOME & PARTICIPATION", [state.welcome, state.participation].filter(Boolean).join("\n")],
      ["A LOOSE PLAN", state.pacing],
      ["IF PLANS CHANGE", state.fallback],
      ["AFTERWARD", state.afterward]
    ];
    return [
      "SET A TABLE WORTH STAYING AT",
      "My Table Score · Wine With Pete",
      "",
      ...values.map(([label, value]) => `${label}\n${value?.trim() || "—"}\n`),
      "A working plan, not a script. Make it your own."
    ].join("\n");
  }

  function downloadScore() {
    const blob = new Blob([buildScoreText()], { type: "text/plain;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "wine-with-pete-table-score.txt";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }

  document.querySelectorAll("[data-field]").forEach(input => {
    input.addEventListener("input", event => {
      const field = event.currentTarget.dataset.field;
      state[field] = event.currentTarget.value.slice(0, 5000);
      saveState();
      renderScore();
    });
  });

  document.querySelectorAll("[data-choice-group]").forEach(button => {
    button.addEventListener("click", event => {
      const { choiceGroup: field, choice } = event.currentTarget.dataset;
      if (event.currentTarget.dataset.multi === "true") {
        const current = state[field];
        state[field] = current.includes(choice) ? current.filter(x => x !== choice) : [...current, choice];
      } else {
        state[field] = choice;
      }
      saveState();
      renderInputs();
      renderScore();
    });
  });

  document.querySelectorAll("[data-step-nav]").forEach(button => button.addEventListener("click", () => showStep(Number(button.dataset.stepNav))));
  document.querySelectorAll("[data-next]").forEach(button => button.addEventListener("click", () => showStep(activeStep + 1)));
  document.querySelectorAll("[data-prev]").forEach(button => button.addEventListener("click", () => showStep(activeStep - 1)));
  document.querySelectorAll("[data-print]").forEach(button => button.addEventListener("click", () => window.print()));
  document.querySelectorAll("[data-download]").forEach(button => button.addEventListener("click", downloadScore));
  el("clearDraft").addEventListener("click", () => {
    if (!window.confirm("Clear the answers saved in this browser and start again?")) return;
    state = makeEmpty();
    try { window.localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    renderInputs();
    renderScore();
    showStep(0);
  });

  renderInputs();
  renderScore();
  showStep(0, { moveFocus: false });
})();
