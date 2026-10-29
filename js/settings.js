const buttons = document.querySelectorAll(".opt");

function mark(theme) {
  for (const b of buttons) {
    b.classList.toggle("on", b.dataset.theme === theme);
  }
}

mark(localStorage.getItem("theme") === "white" ? "white" : "black");

for (const b of buttons) {
  b.addEventListener("click", () => {
    const theme = b.dataset.theme;
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("white", theme === "white");
    mark(theme);
  });
}
