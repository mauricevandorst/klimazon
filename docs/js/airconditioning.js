(function () {
  var section = document.querySelector("[data-airco-transform]");
  if (!section) return;

  var slides = section.querySelectorAll("[data-ac-slide]");
  if (!slides.length) return;

  var soundEl = section.querySelector("[data-transform-sound]");
  var labelEls = section.querySelectorAll("[data-ac-energy-label], [data-transform-label]");
  var modelEls = section.querySelectorAll("[data-ac-model]");
  var typeEl = section.querySelector("[data-ac-type]");
  var descriptionEl = section.querySelector("[data-ac-description]");
  var coolingEl = section.querySelector("[data-ac-cooling]");
  var soundDetailEl = section.querySelector("[data-ac-sound-detail]");
  var heatingEl = section.querySelector("[data-ac-heating]");
  var usp1El = section.querySelector("[data-ac-usp-1]");
  var usp2El = section.querySelector("[data-ac-usp-2]");
  var usp3El = section.querySelector("[data-ac-usp-3]");
  var pickButtons = section.querySelectorAll("[data-ac-pick]");
  var picksPrevButton = section.querySelector("[data-ac-picks-prev]");
  var picksNextButton = section.querySelector("[data-ac-picks-next]");
  var activePickClass =
    "group outline-none shrink-0 basis-[calc(50%-0.25rem)] sm:basis-[calc(25%-0.375rem)] snap-start overflow-hidden rounded-[8px] border-2 border-blue-400 bg-blue-400/15 shadow-[0_10px_26px_rgba(6,182,212,0.2)] transition-all duration-300";
  var inactivePickClass =
    "group outline-none shrink-0 basis-[calc(50%-0.25rem)] sm:basis-[calc(25%-0.375rem)] snap-start overflow-hidden rounded-[8px] border-2 border-transparent bg-white/5 transition-all duration-300 hover:border-white/70 hover:-translate-y-0.5";

  var currentIndex = 0;

  function normalizeIndex(index) {
    var length = slides.length;
    if (!length) return 0;
    return ((index % length) + length) % length;
  }

  function updatePickButtons(index) {
    for (var i = 0; i < pickButtons.length; i += 1) {
      var isActive = i === index;
      pickButtons[i].setAttribute("aria-pressed", isActive ? "true" : "false");
      pickButtons[i].className = isActive ? activePickClass : inactivePickClass;
    }
  }

  function setSlide(index) {
    var safeIndex = normalizeIndex(index);
    currentIndex = safeIndex;

    for (var i = 0; i < slides.length; i += 1) {
      var isActive = i === safeIndex;
      slides[i].classList.toggle("hidden", !isActive);
      slides[i].setAttribute("aria-hidden", isActive ? "false" : "true");
    }

    var active = slides[safeIndex];
    var label = active.getAttribute("data-label") || "A++";
    var model = active.getAttribute("data-model") || "";
    var type = active.getAttribute("data-type") || "";
    var description = active.getAttribute("data-description") || "";
    var cooling = active.getAttribute("data-cooling") || "Onbekend";
    var soundIndoor = active.getAttribute("data-sound-indoor") || "Onbekend";
    var soundOutdoor = active.getAttribute("data-sound-outdoor") || "Onbekend";
    var heating = active.getAttribute("data-heating") || "Onbekend";
    var usp1 = active.getAttribute("data-usp-1") || "";
    var usp2 = active.getAttribute("data-usp-2") || "";
    var usp3 = active.getAttribute("data-usp-3") || "";
    var soundDetail = soundIndoor + " / " + soundOutdoor;

    if (soundEl) soundEl.textContent = soundDetail;
    if (labelEls.length) {
      for (var labelIndex = 0; labelIndex < labelEls.length; labelIndex += 1) {
        labelEls[labelIndex].textContent = label;
      }
    }
    if (modelEls.length) {
      for (var modelIndex = 0; modelIndex < modelEls.length; modelIndex += 1) {
        modelEls[modelIndex].textContent = model;
      }
    }
    if (typeEl) typeEl.textContent = type;
    if (descriptionEl) descriptionEl.textContent = description;
    if (coolingEl) coolingEl.textContent = cooling;
    if (soundDetailEl) soundDetailEl.textContent = soundDetail;
    if (heatingEl) heatingEl.textContent = heating;
    if (usp1El) usp1El.textContent = usp1;
    if (usp2El) usp2El.textContent = usp2;
    if (usp3El) usp3El.textContent = usp3;

    updatePickButtons(safeIndex);
  }

  function setSlideAndResetTimer(index) {
    setSlide(index);
  }

  for (var i = 0; i < pickButtons.length; i += 1) {
    (function (index) {
      pickButtons[index].addEventListener("click", function () {
        setSlideAndResetTimer(index);
      });
    })(i);
  }
  if (picksPrevButton) {
    picksPrevButton.addEventListener("click", function () {
      setSlideAndResetTimer(currentIndex - 1);
    });
  }
  if (picksNextButton) {
    picksNextButton.addEventListener("click", function () {
      setSlideAndResetTimer(currentIndex + 1);
    });
  }

  setSlide(0);
})();
