let links = document.querySelectorAll("nav button");

//get File location, pop() removes last element in array and then return it
let current = window.location.pathname.split("/").pop();
for(i = 0; i < 5; i++){
    if(links[i].innerText.toLowerCase() + ".html" == current){
        let page = document.getElementById(links[i].innerText.toLowerCase());

        page.style.padding = "10px 25px";
        page.style.backgroundColor = "rgba(255, 30, 0, 0.9)";
        page.style.borderRadius = "10px";
    }
}

/* ORIGINAL ACTIVE LINK HIGHLIGHT (unchanged) */
let links = document.querySelectorAll("nav button");
let current = window.location.pathname.split("/").pop();

for(i = 0; i < links.length; i++){ // FIXED loop length dynamic
  if(links[i].innerText.toLowerCase() + ".html" == current){
    links[i].style.padding = "10px 25px";
    links[i].style.backgroundColor = "rgba(255, 30, 0, 0.9)";
    links[i].style.borderRadius = "10px";
  }
}

// ===== ADDED HERE: Any future interactive JS can go below ===== //
// e.g., animating news ticker faster on hover, etc.
// EXAMPLE:
// document.querySelector('.news-ticker').addEventListener('mouseover', () => {
//   document.querySelector('.news-ticker span').style.animationPlayState = 'paused';
// });
