// Runs in <head> so the saved theme is applied before the page paints.
if (localStorage.getItem("theme") === "light") {
  document.documentElement.classList.add("light");
}
