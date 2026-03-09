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
  var mainCarousel = section.querySelector("[data-ac-carousel]");
  var mainPrevButton = section.querySelector("[data-ac-main-prev]");
  var mainNextButton = section.querySelector("[data-ac-main-next]");
  var picksTrack = section.querySelector("[data-ac-picks]");
  var pickButtons = section.querySelectorAll("[data-ac-pick]");
  var picksPrevButton = section.querySelector("[data-ac-picks-prev]");
  var picksNextButton = section.querySelector("[data-ac-picks-next]");
  var activePickClass =
    "group outline-none shrink-0 basis-[calc(50%-0.25rem)] sm:basis-[calc(25%-0.375rem)] snap-start overflow-hidden rounded-[8px] border-2 border-blue-400 bg-blue-400/15 shadow-[0_10px_26px_rgba(6,182,212,0.2)] transition-all duration-300";
  var inactivePickClass =
    "group outline-none shrink-0 basis-[calc(50%-0.25rem)] sm:basis-[calc(25%-0.375rem)] snap-start overflow-hidden rounded-[8px] border-2 border-transparent bg-white/5 transition-all duration-300 hover:border-white/70 hover:-translate-y-0.5";

  var currentIndex = 0;
  var touchStartX = null;
  var touchStartY = null;
  var touchTriggered = false;

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

  function scrollActivePickIntoView(index) {
    if (!picksTrack || !pickButtons.length) return;
    var activePick = pickButtons[index];
    if (!activePick) return;

    var pickLeft = activePick.offsetLeft;
    var pickRight = pickLeft + activePick.offsetWidth;
    var visibleLeft = picksTrack.scrollLeft;
    var visibleRight = visibleLeft + picksTrack.clientWidth;

    if (pickLeft < visibleLeft || pickRight > visibleRight) {
      var targetLeft = pickLeft - (picksTrack.clientWidth - activePick.offsetWidth) / 2;
      var maxScrollLeft = Math.max(0, picksTrack.scrollWidth - picksTrack.clientWidth);
      var clampedLeft = Math.max(0, Math.min(targetLeft, maxScrollLeft));
      picksTrack.scrollTo({
        left: clampedLeft,
        behavior: "smooth"
      });
    }
  }

  function prepareSlides() {
    for (var i = 0; i < slides.length; i += 1) {
      slides[i].classList.remove("hidden");
      slides[i].style.opacity = "0";
      slides[i].style.transform = "scale(1.015)";
      slides[i].style.transition = "opacity 380ms ease, transform 380ms ease";
      slides[i].style.pointerEvents = "none";
      slides[i].style.zIndex = "1";
      slides[i].setAttribute("aria-hidden", "true");
    }
  }

  function setSlide(index) {
    var safeIndex = normalizeIndex(index);
    currentIndex = safeIndex;

    for (var i = 0; i < slides.length; i += 1) {
      var isActive = i === safeIndex;
      slides[i].style.opacity = isActive ? "1" : "0";
      slides[i].style.transform = isActive ? "scale(1)" : "scale(1.015)";
      slides[i].style.pointerEvents = isActive ? "auto" : "none";
      slides[i].style.zIndex = isActive ? "2" : "1";
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
    scrollActivePickIntoView(safeIndex);
  }

  function setSlideAndResetTimer(index) {
    setSlide(index);
  }

  function scrollPicksTrack(direction) {
    if (!picksTrack) return;

    var firstPick = pickButtons[0];
    if (!firstPick) return;

    var gapValue = window.getComputedStyle(picksTrack).columnGap || window.getComputedStyle(picksTrack).gap || "0";
    var gap = parseFloat(gapValue) || 0;
    var step = firstPick.getBoundingClientRect().width + gap;
    var maxScrollLeft = Math.max(0, picksTrack.scrollWidth - picksTrack.clientWidth);
    var currentScrollLeft = picksTrack.scrollLeft;
    var edgeTolerance = 2;

    if (direction > 0 && currentScrollLeft >= maxScrollLeft - edgeTolerance) {
      picksTrack.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    if (direction < 0 && currentScrollLeft <= edgeTolerance) {
      picksTrack.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
      return;
    }

    picksTrack.scrollBy({
      left: step * direction,
      behavior: "smooth"
    });
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
      scrollPicksTrack(-1);
    });
  }
  if (picksNextButton) {
    picksNextButton.addEventListener("click", function () {
      scrollPicksTrack(1);
    });
  }
  if (mainPrevButton) {
    mainPrevButton.addEventListener("click", function (event) {
      event.stopPropagation();
      setSlideAndResetTimer(currentIndex - 1);
    });
  }
  if (mainNextButton) {
    mainNextButton.addEventListener("click", function (event) {
      event.stopPropagation();
      setSlideAndResetTimer(currentIndex + 1);
    });
  }
  if (mainCarousel) {
    mainCarousel.addEventListener("click", function (event) {
      if (event.target && event.target.closest("button")) return;

      var bounds = mainCarousel.getBoundingClientRect();
      var clickX = event.clientX - bounds.left;
      var clickedLeftHalf = clickX < bounds.width / 2;
      setSlideAndResetTimer(clickedLeftHalf ? currentIndex - 1 : currentIndex + 1);
    });

    mainCarousel.addEventListener(
      "touchstart",
      function (event) {
        if (!event.touches || event.touches.length !== 1) return;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        touchTriggered = false;
      },
      { passive: true }
    );

    mainCarousel.addEventListener(
      "touchmove",
      function (event) {
        if (touchStartX === null || touchStartY === null || touchTriggered) return;
        if (!event.touches || event.touches.length !== 1) return;

        var deltaX = event.touches[0].clientX - touchStartX;
        var deltaY = event.touches[0].clientY - touchStartY;
        var absX = Math.abs(deltaX);
        var absY = Math.abs(deltaY);
        var swipeThreshold = 40;

        if (absX > swipeThreshold && absX > absY) {
          setSlideAndResetTimer(deltaX < 0 ? currentIndex + 1 : currentIndex - 1);
          touchTriggered = true;
        }
      },
      { passive: true }
    );

    mainCarousel.addEventListener(
      "touchend",
      function () {
        touchStartX = null;
        touchStartY = null;
        touchTriggered = false;
      },
      { passive: true }
    );
  }

  prepareSlides();
  setSlide(0);
})();

