document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    let valid = true;

    form.querySelectorAll("[required]").forEach((field) => {
      const error = document.getElementById(`error-${field.name}`);

      if (!field.checkValidity()) {
        valid = false;
        field.setAttribute("aria-invalid", "true");
        if (error) error.classList.remove("hidden");
      } else {
        field.removeAttribute("aria-invalid");
        if (error) error.classList.add("hidden");
      }
    });

    if (!valid) e.preventDefault();
  });
});
