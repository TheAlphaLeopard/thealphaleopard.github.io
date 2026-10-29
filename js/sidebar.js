const toggle = document.getElementById("nav-toggle");

function sync() {
  const closed = document.documentElement.classList.contains("closed");
  toggle.textContent = closed ? ">>" : "<<";
  toggle.setAttribute("aria-expanded", String(!closed));
}

toggle.addEventListener("click", () => {
  const closed = !document.documentElement.classList.contains("closed");
  document.documentElement.classList.toggle("closed", closed);
  localStorage.setItem("sidebar", closed ? "closed" : "open");
  sync();
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  document.documentElement.classList.add("closed");
  localStorage.setItem("sidebar", "closed");
  sync();
});

sync();
