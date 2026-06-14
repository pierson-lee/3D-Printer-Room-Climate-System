document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".nav-item");
  const path = window.location.pathname;

  links.forEach(link => {
    const href = link.getAttribute("href");

    // Home page special case
    if (path === "/" && href === "/") {
      link.classList.add("active");
    }

    // exact match for other pages
    if (href === path) {
      link.classList.add("active");
    }
  });
});