(() => {
  const FORM_ID = "73potop8oom";
  const forminit = new Forminit();

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const result = document.getElementById("result");

    if (!form || !result) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const { data, error } = await forminit.submit(FORM_ID, formData);

      if (error) {
        result.textContent = error.message;
        return;
      }

      result.textContent = "Uw aanvraag is verzonden. Wij nemen snel contact met u op.";
      form.reset();
    });
  });
})();
