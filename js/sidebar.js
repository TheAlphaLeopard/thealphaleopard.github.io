const toggle = document.getElementById("nav-toggle");

function sync() {
  const closed = document.documentElement.classList.contains("nav-closed");
  toggle.textContent = closed ? "☰" : "✕";
  toggle.setAttribute("aria-expanded", String(!closed));
}

function setClosed(closed) {
  document.documentElement.classList.toggle("nav-closed", closed);
  localStorage.setItem("sidebar", closed ? "closed" : "open");
  sync();
}

toggle.addEventListener("click", () => {
  setClosed(!document.documentElement.classList.contains("nav-closed"));
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setClosed(true);
});

sync();
