// Runs in <head>: applies saved theme and sidebar state before paint.
(function () {
  if (localStorage.getItem("theme") === "white") {
    document.documentElement.classList.add("white");
  }

  if (localStorage.getItem("sidebar") === "closed") {
    document.documentElement.classList.add("closed");
  }
})();
