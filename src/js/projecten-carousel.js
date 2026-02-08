(function () {
  var carousels = document.querySelectorAll('[data-carousel]');
  carousels.forEach(function (carousel) {
    var images = carousel.querySelectorAll('.carousel-image');
    var prev = carousel.querySelector('[data-carousel-prev]');
    var next = carousel.querySelector('[data-carousel-next]');
    var index = 0;

    function show(i) {
      images.forEach(function (img, idx) {
        img.classList.toggle('hidden', idx !== i);
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        index = (index - 1 + images.length) % images.length;
        show(index);
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        index = (index + 1) % images.length;
        show(index);
      });
    }
  });
})();
