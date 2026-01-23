function loadLanguage(lang) {
  fetch(`frontend/i18n/${lang}.json`)
    .then(response => response.json())
    .then(translations => {
      document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");
        element.textContent = translations[key] || key;
      });

      localStorage.setItem("selectedLanguage", lang);
    })
    .catch(error => {
      console.error("Error loading language file:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const languageSwitcher = document.getElementById("languageSwitcher");
  const savedLanguage = localStorage.getItem("selectedLanguage") || "en";

  if (languageSwitcher) {
    languageSwitcher.value = savedLanguage;

    languageSwitcher.addEventListener("change", (e) => {
      loadLanguage(e.target.value);
    });
  }

  loadLanguage(savedLanguage);
});
