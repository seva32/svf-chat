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
