const select = document.getElementById("theme");

select.value = localStorage.getItem("theme") === "light" ? "light" : "amoled";

select.addEventListener("change", () => {
  localStorage.setItem("theme", select.value);
  document.documentElement.classList.toggle("light", select.value === "light");
});
