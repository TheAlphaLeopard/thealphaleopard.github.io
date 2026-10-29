// Runs in <head> so the saved theme and sidebar state apply before paint.
(function () {
  if (localStorage.getItem("theme") === "light") {
    document.documentElement.classList.add("light");
  }

  var sidebar = localStorage.getItem("sidebar");
  if (sidebar === "closed" || (sidebar === null && window.innerWidth < 700)) {
    document.documentElement.classList.add("nav-closed");
  }
})();
