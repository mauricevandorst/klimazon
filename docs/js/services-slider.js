(() => {
  const track = document.getElementById("servicesTrack");
  const prev = document.getElementById("prevBtn");
  const next = document.getElementById("nextBtn");
  const dots = Array.from(document.querySelectorAll(".dot"));

  let index = 0;
  const max = 1;

  const update = () => {
    track.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach((d, i) => {
      d.classList.toggle("is-active", i === index);
    });
  };

  prev.addEventListener("click", () => {
    index = Math.max(0, index - 1);
    update();
  });

  next.addEventListener("click", () => {
    index = Math.min(max, index + 1);
    update();
  });

  dots.forEach((d, i) =>
    d.addEventListener("click", () => {
      index = i;
      update();
    })
  );

  update();
})();
