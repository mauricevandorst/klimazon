(() => {
  function initHeroImageReveal() {
    const minDelayMs = 220;
    const heroImages = document.querySelectorAll("[data-hero-image]");

    heroImages.forEach((img) => {
      const startedAt = performance.now();
      const wrapper = img.closest("[data-hero-image-wrap]");
      const skeleton = wrapper ? wrapper.querySelector("[data-hero-skeleton]") : null;

      function revealImage() {
        const elapsed = performance.now() - startedAt;
        const remaining = Math.max(0, minDelayMs - elapsed);

        window.setTimeout(() => {
          img.classList.remove("opacity-0");
          if (skeleton) {
            skeleton.classList.add("opacity-0", "pointer-events-none");
            window.setTimeout(() => skeleton.remove(), 260);
          }
        }, remaining);
      }

      if (img.complete && img.naturalWidth > 0) {
        revealImage();
        return;
      }

      img.addEventListener("load", revealImage, { once: true });
      img.addEventListener("error", revealImage, { once: true });
    });
  }

  function initContractDropdown() {
    const dropdown = document.querySelector("[data-contract-dropdown]");
    if (!dropdown) return;

    const trigger = dropdown.querySelector("#plan-button");
    const menu = dropdown.querySelector("ul[role='listbox']");
    const hiddenInput = dropdown.querySelector("input[name='plan']");
    const optionButtons = dropdown.querySelectorAll("button[data-value]");

    if (!trigger || !menu || !hiddenInput || !optionButtons.length) return;

    const triggerLabel = trigger.querySelector("span.font-medium");
    const triggerDot = trigger.querySelector("span.h-4.w-4.rounded-full");

    function setOpen(isOpen) {
      menu.classList.toggle("hidden", !isOpen);
      trigger.setAttribute("aria-expanded", String(isOpen));
    }

    function updateSelected(value, label, dotClass) {
      hiddenInput.value = value;
      if (triggerLabel) triggerLabel.textContent = label;
      if (triggerDot) triggerDot.className = "h-4 w-4 rounded-full " + dotClass;

      optionButtons.forEach((btn) => {
        btn.classList.remove("bg-slate-100");
        if (btn.dataset.value === value) {
          btn.classList.add("bg-slate-100");
        }
      });
    }

    function selectContract(value) {
      const selectedButton = Array.from(optionButtons).find(
        (btn) => btn.dataset.value === value
      );
      if (!selectedButton) return;

      updateSelected(
        selectedButton.dataset.value,
        selectedButton.dataset.label,
        selectedButton.dataset.dotClass
      );
    }

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      setOpen(!isOpen);
    });

    optionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        updateSelected(
          button.dataset.value,
          button.dataset.label,
          button.dataset.dotClass
        );
        setOpen(false);
      });
    });

    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    });

    const contractFormSection = document.getElementById("contract-formulier");
    const contractCtaButtons = document.querySelectorAll("[data-contract-select]");

    contractCtaButtons.forEach((button) => {
      button.addEventListener("click", () => {
        selectContract(button.dataset.contractSelect);
        setOpen(false);

        if (contractFormSection) {
          contractFormSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        window.setTimeout(() => trigger.focus(), 350);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initHeroImageReveal();
    initContractDropdown();
  });
})();
