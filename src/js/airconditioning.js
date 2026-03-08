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

  function scrollPicksTrack(direction) {
    if (!picksTrack) return;

    var firstPick = pickButtons[0];
    if (!firstPick) return;

    var gapValue = window.getComputedStyle(picksTrack).columnGap || window.getComputedStyle(picksTrack).gap || "0";
    var gap = parseFloat(gapValue) || 0;
    var step = firstPick.getBoundingClientRect().width + gap;

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
  }

  setSlide(0);
})();

(function () {
  var testimonials = document.querySelector("[data-airco-testimonials]");
  if (!testimonials) return;

  var quoteEl = testimonials.querySelector("[data-testimonial-quote]");
  var authorEl = testimonials.querySelector("[data-testimonial-author]");
  var pickButtons = testimonials.querySelectorAll("[data-testimonial-pick]");
  if (!quoteEl || !authorEl || pickButtons.length !== 3) return;

  var entries = [
    {
      quote:
        '"Een heel fijn bedrijf met uiterst secure, vakbekwame en vriendelijke vakmensen. Een genot om zaken mee te doen! De servicegerichtheid en ouderwetse vriendelijkheid (waar vind je dat nog?) doen de rest."',
      author: '<span class="font-extrabold">JJ</span> — Airco-installatie'
    },
    {
      quote:
        '"Goede vaklui die eerlijk met je meedenken. Fijne en snelle communicatie, die na het installeren ook alles netjes achter laten. Absolute aanraders voor het plaatsen van zonnepanelen."',
      author: '<span class="font-extrabold">Lars</span> — Zonnepanelen installatie'
    },
    {
      quote:
        '"Klimazon dacht goed mee over de beste oplossing voor ons huis. De installatie van de warmtepomp verliep soepel en alles werd duidelijk uitgelegd."',
      author: '<span class="font-extrabold">Toni</span> — Dubbele airco in Amsterdam'
    }
  ];
  var activeIndex = 0;
  var animationFrameId = null;
  var intervalMs = 8000;
  var cycleStartTime = 0;
  var activeRingColor = "rgba(251, 146, 60, 1)";
  var inactiveRingColor = "rgba(255, 255, 255, 0.35)";

  function normalizeIndex(index) {
    var length = entries.length;
    return ((index % length) + length) % length;
  }

  function render(index) {
    var safeIndex = normalizeIndex(index);
    activeIndex = safeIndex;
    quoteEl.textContent = entries[safeIndex].quote;
    authorEl.innerHTML = entries[safeIndex].author;

    for (var i = 0; i < pickButtons.length; i += 1) {
      var isActive = i === safeIndex;
      pickButtons[i].setAttribute("aria-pressed", isActive ? "true" : "false");
      pickButtons[i].style.zIndex = isActive ? "30" : String(10 - i);
      pickButtons[i].style.transform = isActive ? "translateY(-1px) scale(1.06)" : "translateY(0) scale(1)";
      pickButtons[i].style.boxShadow = isActive ? "0 0 0 2px rgba(255,255,255,0.5)" : "none";
      pickButtons[i].style.background = "conic-gradient(" + inactiveRingColor + " 360deg, " + inactiveRingColor + " 360deg)";
    }
  }

  function paintProgress(progressRatio) {
    var progressDegrees = Math.max(0, Math.min(progressRatio, 1)) * 360;
    for (var i = 0; i < pickButtons.length; i += 1) {
      if (i === activeIndex) {
        pickButtons[i].style.background =
          "conic-gradient(" +
          activeRingColor +
          " " +
          progressDegrees +
          "deg, " +
          inactiveRingColor +
          " " +
          progressDegrees +
          "deg 360deg)";
      }
    }
  }

  function stopAnimation() {
    if (animationFrameId !== null) {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  function animationStep(now) {
    if (!cycleStartTime) {
      cycleStartTime = now;
    }

    var elapsed = now - cycleStartTime;
    if (elapsed >= intervalMs) {
      render(activeIndex + 1);
      cycleStartTime = now;
      elapsed = 0;
    }

    paintProgress(elapsed / intervalMs);
    animationFrameId = window.requestAnimationFrame(animationStep);
  }

  function startAnimation() {
    stopAnimation();
    cycleStartTime = 0;
    animationFrameId = window.requestAnimationFrame(animationStep);
  }

  function setActiveAndRestartCycle(index) {
    render(index);
    startAnimation();
  }

  for (var i = 0; i < pickButtons.length; i += 1) {
    (function (index) {
      pickButtons[index].addEventListener("click", function () {
        setActiveAndRestartCycle(index);
      });
    })(i);
  }

  render(0);
  startAnimation();
})();
