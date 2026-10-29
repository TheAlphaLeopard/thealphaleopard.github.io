// Runs in <head> so the saved theme applies before paint.
if (localStorage.getItem("theme") === "white") {
  document.documentElement.classList.add("white");
}
