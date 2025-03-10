async function loadTranslations(lang) {
  const res = await fetch(`/locales/${lang}.json`);
  return res.json();
}

async function changeLanguage(lang) {
  localStorage.setItem("lang", lang);
  const translations = await loadTranslations(lang);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[key]) {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = translations[key];
      } else {
        el.innerText = translations[key];
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Auto-detect language (default to English)
  const userLang = navigator.language.split("-")[0];
  const langLS = localStorage.getItem("lang");
  changeLanguage(langLS || userLang || "en");
});

function toggleDropdown() {
  const dropdown = document.querySelector(".dropdown");
  const button = document.getElementById("dropdown-button");
  const isExpanded = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", !isExpanded);
  dropdown.classList.toggle("active");
}

function selectLanguage(lang) {
  document.getElementById("selected-lang").innerText = lang;
  document
    .getElementById("dropdown-button")
    .setAttribute("aria-expanded", "false");
  document.querySelector(".dropdown").classList.remove("active");
  changeLanguage(lang?.toLowerCase() || "en");
}

function handleKeyDown(event, lang) {
  if (event.key === "Enter" || event.key === " ") {
    selectLanguage(lang);
  }
}

document.addEventListener("click", function (event) {
  if (!event.target.closest(".dropdown")) {
    document.querySelector(".dropdown").classList.remove("active");
    document
      .getElementById("dropdown-button")
      .setAttribute("aria-expanded", "false");
  }
});
