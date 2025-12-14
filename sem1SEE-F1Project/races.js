(function navHighlight(){
  const links = document.querySelectorAll("nav button");
  const current = window.location.pathname.split("/").pop();

  for (let i = 0; i < Math.min(links.length, 5); i++) {
    try {
      if (links[i].innerText.toLowerCase() + ".html" === current) {
        const page = document.getElementById(links[i].innerText.toLowerCase());
        if (page) {
          page.style.padding = "10px 25px";
          page.style.backgroundColor = "rgba(255, 30, 0, 0.9)";
          page.style.borderRadius = "10px";
        }
      }
    } catch (e) { /* ignore missing items */ }
  }
})();

