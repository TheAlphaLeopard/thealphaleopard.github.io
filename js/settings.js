const toggle = document.getElementById("light");

toggle.checked = localStorage.getItem("theme") === "light";

toggle.addEventListener("change", () => {
  localStorage.setItem("theme", toggle.checked ? "light" : "dark");
  document.documentElement.classList.toggle("light", toggle.checked);
});
