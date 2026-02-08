(() => {
  const STORAGE_KEY = "solarCalculatorState";
  const DEFAULT_STATE = {
    step: 0,
    persons: 2,
    homeType: "",
    electricCooking: "",
    heatPump: "",
    usageMode: "known",
    annualKwh: "",
    monthlyCost: "",
    pricePerKwh: "0.30",
    estimateLevel: "average",
    roofDirection: "Z",
    roofPitch: 30,
    roofShade: "none",
    roofPanelsMax: "",
    roofAreaM2: "",
    panelWatt: 400,
  };

  const DIRECTION_FACTORS = {
    Z: 1.0,
    ZO: 0.95,
    ZW: 0.95,
    O: 0.85,
    W: 0.85,
    NO: 0.75,
    NW: 0.75,
    N: 0.65,
  };

  const SHADE_FACTORS = {
    none: 1.0,
    light: 0.9,
    medium: 0.8,
    heavy: 0.65,
  };

  const ESTIMATE_LEVEL_KWH = {
    low: 2500,
    average: 3500,
    high: 5000,
  };

  const PRICE_PER_PANEL = 250;

  const readStorage = () => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return typeof data === "object" && data ? data : {};
    } catch {
      return {};
    }
  };

  const writeStorage = (allStates) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allStates));
  };

  const formatNumber = (value, decimals = 0) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return "-";
    return new Intl.NumberFormat("nl-NL", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getPitchFactor = (pitch) => {
    if (pitch <= 10) return 0.9;
    if (pitch >= 50) return 0.9;
    if (pitch >= 30 && pitch <= 35) return 1.0;
    if (pitch < 30) {
      return 0.9 + (pitch - 10) * (0.1 / 20);
    }
    return 1.0 - (pitch - 35) * (0.1 / 15);
  };

  const estimateAnnualKwh = (state) => {
    if (state.usageMode === "known") {
      return Number(state.annualKwh) || 0;
    }
    const monthly = Number(state.monthlyCost);
    const price = Number(state.pricePerKwh);
    if (monthly > 0 && price > 0) {
      return (monthly * 12) / price;
    }
    const base = ESTIMATE_LEVEL_KWH[state.estimateLevel] || 3500;
    const persons = Math.max(Number(state.persons) || 1, 1);
    const basePersons = Math.min(persons, 6);
    const extraPersons = Math.max(persons - 6, 0);
    const adjustment = (basePersons - 2) * 250 + extraPersons * 150;
    return Math.max(base + adjustment, 1500);
  };

  const calculateResults = (state) => {
    const annualKwh = estimateAnnualKwh(state);
    const kWpRecommended = Math.round((annualKwh / 900) * 10) / 10;
    const panelWatt = Number(state.panelWatt) || 400;
    const requiredPanels = Math.ceil((kWpRecommended * 1000) / panelWatt);

    const maxByPanels = Number(state.roofPanelsMax) || Infinity;
    const maxByM2 = state.roofAreaM2
      ? Math.floor(Number(state.roofAreaM2) / 1.7)
      : Infinity;
    const maxPanels = Math.min(maxByPanels, maxByM2);
    const finalPanels = Math.min(requiredPanels, maxPanels);
    const actualPanels = Number.isFinite(finalPanels) ? finalPanels : requiredPanels;

    const actualKwp = (actualPanels * panelWatt) / 1000;
    const directionFactor = DIRECTION_FACTORS[state.roofDirection] || 0.85;
    const pitchFactor = getPitchFactor(Number(state.roofPitch) || 30);
    const shadeFactor = SHADE_FACTORS[state.roofShade] || 1.0;
    const yieldPerKwp = 900 * directionFactor * pitchFactor * shadeFactor;
    const annualYield = actualKwp * yieldPerKwp;
    const pricePerKwh = Number(state.pricePerKwh) || 0.3;
    const savings = annualYield * pricePerKwh;
    const payback = savings > 0 ? (actualPanels * PRICE_PER_PANEL) / savings : 0;

    return {
      annualKwh,
      kWpRecommended,
      actualKwp,
      requiredPanels,
      actualPanels,
      annualYield,
      savings,
      payback,
      yieldPerKwp,
      pricePerKwh,
      panelWatt,
      limitedByRoof: actualPanels < requiredPanels,
    };
  };

  const setActiveStep = (container, stepIndex) => {
    const tabs = [...container.querySelectorAll("[data-step-tab]")];
    const panels = [...container.querySelectorAll("[data-step-panel]")];

    tabs.forEach((tab, index) => {
      const active = index === stepIndex;
      tab.setAttribute("aria-selected", active ? "true" : "false");
      tab.classList.toggle("bg-slate-900", active);
      tab.classList.toggle("text-white", active);
      tab.classList.toggle("text-slate-700", !active);
      tab.classList.toggle("border-slate-400", active);
      tab.classList.toggle("border-slate-200", !active);
    });

    panels.forEach((panel, index) => {
      const isActive = index === stepIndex;
      if (isActive) {
        panel.hidden = false;
        panel.classList.remove("opacity-0", "-translate-x-2", "pointer-events-none");
        panel.classList.add("opacity-100", "translate-x-0");
      } else {
        panel.classList.add("opacity-0", "-translate-x-2", "pointer-events-none");
        panel.classList.remove("opacity-100", "translate-x-0");
        window.setTimeout(() => {
          if (!panel.classList.contains("opacity-100")) {
            panel.hidden = true;
          }
        }, 200);
      }
    });
  };

  const renderResults = (container, state) => {
    const results = calculateResults(state);
    const fields = {
      annualKwh: formatNumber(results.annualKwh, 0),
      recommendedKwp: formatNumber(results.kWpRecommended, 1),
      panelCount: formatNumber(results.actualPanels, 0),
      annualYield: formatNumber(results.annualYield, 0),
      savings: formatNumber(results.savings, 0),
      payback: formatNumber(results.payback, 1),
      yieldPerKwp: formatNumber(results.yieldPerKwp, 0),
      pricePerKwh: formatNumber(results.pricePerKwh, 2),
      panelWatt: formatNumber(results.panelWatt, 0),
    };

    Object.entries(fields).forEach(([key, value]) => {
      const target = container.querySelector(`[data-result="${key}"]`);
      if (target) target.textContent = value;
    });

    const note = container.querySelector("[data-result='roofNote']");
    if (note) {
      note.textContent = results.limitedByRoof
        ? "Let op: de berekening is begrensd door de opgegeven dakruimte."
        : "";
    }
  };

  const renderStep = (container, state, stepIndex) => {
    setActiveStep(container, stepIndex);
    const estimateValue = estimateAnnualKwh(state);
    const estimateTarget = container.querySelector("[data-live='estimateKwh']");
    if (estimateTarget) {
      estimateTarget.textContent = formatNumber(estimateValue, 0);
    }
    renderResults(container, state);
  };

  const checkStepValidity = (container, state, stepIndex, showErrors = false) => {
    let valid = true;

    const showError = (field, message) => {
      if (!showErrors) return;
      const error = container.querySelector(`[data-error-for="${field}"]`);
      if (error) {
        error.textContent = message;
      }
    };

    const clearError = (field) => {
      if (!showErrors) return;
      const error = container.querySelector(`[data-error-for="${field}"]`);
      if (error) error.textContent = "";
    };

    if (stepIndex === 0) {
      if (!state.persons) {
        showError("persons", "Vul het aantal personen in.");
        valid = false;
      } else {
        clearError("persons");
      }
      if (!state.homeType) {
        showError("homeType", "Kies een type woning.");
        valid = false;
      } else {
        clearError("homeType");
      }
      if (!state.electricCooking) {
        showError("electricCooking", "Selecteer een optie.");
        valid = false;
      } else {
        clearError("electricCooking");
      }
      if (!state.heatPump) {
        showError("heatPump", "Selecteer een optie.");
        valid = false;
      } else {
        clearError("heatPump");
      }
    }

    if (stepIndex === 1) {
      if (state.usageMode === "known") {
        if (!(Number(state.annualKwh) > 0)) {
          showError("annualKwh", "Vul je jaarverbruik in.");
          valid = false;
        } else {
          clearError("annualKwh");
        }
      } else {
        clearError("annualKwh");
      }

      if (!(Number(state.pricePerKwh) > 0)) {
        showError("pricePerKwh", "Vul een stroomprijs in.");
        valid = false;
      } else {
        clearError("pricePerKwh");
      }
    }

    if (stepIndex === 2) {
      if (!state.roofDirection) {
        showError("roofDirection", "Kies een dakrichting.");
        valid = false;
      } else {
        clearError("roofDirection");
      }
      if (!(Number(state.roofPitch) >= 0)) {
        showError("roofPitch", "Vul een dakhelling in.");
        valid = false;
      } else {
        clearError("roofPitch");
      }
      if (!state.roofShade) {
        showError("roofShade", "Kies een schaduwindicatie.");
        valid = false;
      } else {
        clearError("roofShade");
      }
      if (!(Number(state.panelWatt) > 0)) {
        showError("panelWatt", "Vul het paneelvermogen in.");
        valid = false;
      } else {
        clearError("panelWatt");
      }
    }

    return valid;
  };

  const validateStep = (container, state, stepIndex) =>
    checkStepValidity(container, state, stepIndex, true);

  const clearErrors = (container) => {
    const errors = container.querySelectorAll("[data-error-for]");
    errors.forEach((error) => {
      error.textContent = "";
    });
  };

  const updateStateFromInput = (state, input) => {
    const field = input.getAttribute("data-field");
    if (!field) return state;
    const value = input.type === "checkbox" ? input.checked : input.value;
    return { ...state, [field]: value };
  };

  const syncInputs = (container, state) => {
    const fields = container.querySelectorAll("[data-field]");
    fields.forEach((input) => {
      const field = input.getAttribute("data-field");
      if (!(field in state)) return;
      if (input.type === "radio") {
        input.checked = input.value === String(state[field]);
      } else {
        input.value = state[field];
      }
    });

    const mode = state.usageMode;
    const knownBlock = container.querySelector("[data-mode='known']");
    const estimateBlock = container.querySelector("[data-mode='estimate']");
    if (knownBlock && estimateBlock) {
      knownBlock.classList.toggle("hidden", mode !== "known");
      estimateBlock.classList.toggle("hidden", mode !== "estimate");
    }
  };

  const initCalculator = (container) => {
    const id = container.getAttribute("id") || `calc-${Math.random().toString(36).slice(2)}`;
    container.setAttribute("data-calculator-id", id);

    const allStates = readStorage();
    const stored = allStates[id];
    let state = { ...DEFAULT_STATE, ...(stored || {}) };
    let stepIndex = Number(state.step) || 0;
    let hasInteracted = false;

    const saveState = () => {
      const updatedAll = readStorage();
      updatedAll[id] = { ...state, step: stepIndex };
      writeStorage(updatedAll);
    };

    const goToStep = (nextStep) => {
      const clamped = clamp(nextStep, 0, 3);
      stepIndex = clamped;
      state = { ...state, step: stepIndex };
      renderStep(container, state, stepIndex);
      saveState();
    };

    const updateNavButtons = () => {
      const prevBtn = container.querySelector("[data-action='prev']");
      const nextBtn = container.querySelector("[data-action='next']");
      const resultBtn = container.querySelector("[data-action='result']");
      const resetBtn = container.querySelector("[data-action='reset']");
      const stepValid = checkStepValidity(container, state, stepIndex, false);
      if (prevBtn) prevBtn.disabled = stepIndex === 0;
      if (nextBtn) {
        nextBtn.disabled = stepIndex === 3 || !stepValid;
        nextBtn.classList.toggle("hidden", stepIndex === 3);
      }
      if (resultBtn) resultBtn.disabled = stepIndex === 3 || !stepValid;
      if (resetBtn) resetBtn.classList.toggle("hidden", stepIndex !== 3);
      if (!stepValid && hasInteracted) {
        validateStep(container, state, stepIndex);
      }
    };

    const handleInput = (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.matches("[data-field]")) {
        hasInteracted = true;
        state = updateStateFromInput(state, target);
        syncInputs(container, state);
        renderStep(container, state, stepIndex);
        updateNavButtons();
        saveState();
      }
    };

    const handleClick = (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const action = target.getAttribute("data-action");
      if (action === "prev") {
        goToStep(stepIndex - 1);
        updateNavButtons();
      }
      if (action === "next") {
        if (validateStep(container, state, stepIndex)) {
          goToStep(stepIndex + 1);
          updateNavButtons();
        }
      }
      if (action === "result") {
        if (validateStep(container, state, stepIndex)) {
          goToStep(3);
          updateNavButtons();
        }
      }
      if (action === "reset") {
        state = { ...DEFAULT_STATE, step: 0 };
        stepIndex = 0;
        hasInteracted = false;
        clearErrors(container);
        syncInputs(container, state);
        renderStep(container, state, stepIndex);
        updateNavButtons();
        saveState();
      }
      if (target.matches("[data-step-tab]")) {
        const index = Number(target.getAttribute("data-step-tab"));
        if (index <= stepIndex) {
          goToStep(index);
          updateNavButtons();
        }
      }
    };

    container.addEventListener("input", handleInput);
    container.addEventListener("change", handleInput);
    container.addEventListener("click", handleClick);

    syncInputs(container, state);
    renderStep(container, state, stepIndex);
    updateNavButtons();
    saveState();
  };

  const initAll = () => {
    const calculators = document.querySelectorAll("[data-solar-calculator]");
    calculators.forEach((container) => initCalculator(container));
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
