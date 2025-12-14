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

/*data*/
const circuits = {
    monza: {
        name: "Autodromo Nazionale di Monza",
        races: 74,
        country: "Italy",
        lap: "1:21.046",
        image: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Monza_track_map.svg",
        map: { x: "58%", y: "44%" }
    },
    silverstone: {
        name: "Silverstone Circuit",
        races: 58,
        country: "United Kingdom",
        lap: "1:27.097",
        image: "https://upload.wikimedia.org/wikipedia/commons/6/63/Silverstone_Circuit_2020.png",
        map: { x: "50%", y: "38%" }
    },
    spa: {
        name: "Circuit de Spa-Francorchamps",
        races: 55,
        country: "Belgium",
        lap: "1:46.286",
        image: "https://upload.wikimedia.org/wikipedia/commons/5/54/Spa-Francorchamps_of_Belgium.svg",
        map: { x: "53%", y: "40%" }
    },
    monaco: {
        name: "Circuit de Monaco",
        races: 69,
        country: "Monaco",
        lap: "1:12.909",
        image: "https://upload.wikimedia.org/wikipedia/commons/3/36/Monte_Carlo_Formula_1_track_map.svg",
        map: { x: "55%", y: "46%" }
    },
    suzuka: {
        name: "Suzuka Circuit",
        races: 35,
        country: "Japan",
        lap: "1:30.983",
        image: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Suzuka_circuit_map--2005.svg",
        map: { x: "75%", y: "45%" }
    },
    interlagos: {
        name: "Interlagos",
        races: 50,
        country: "Brazil",
        lap: "1:10.540",
        image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Interlagos_track_map.svg",
        map: { x: "40%", y: "70%" }
    },
    melbourne: {
        name: "Albert Park Circuit",
        races: 26,
        country: "Australia",
        lap: "1:20.235",
        image: "https://upload.wikimedia.org/wikipedia/commons/1/15/Albert_Park_Circuit_2021.svg",
        map: { x: "82%", y: "75%" }
    },
    bahrain: {
        name: "Bahrain International Circuit",
        races: 21,
        country: "Bahrain",
        lap: "1:31.447",
        image: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Bahrain_International_Circuit--Grand_Prix_Layout.svg",
        map: { x: "64%", y: "52%" }
    }
};

const listItems = document.querySelectorAll("#circuitList li");
const nameEl = document.getElementById("trackName");
const imgEl = document.getElementById("trackImg");
const statsEl = document.getElementById("trackStats");
const pin = document.getElementById("mapPin");

listItems.forEach(li => {
    li.addEventListener("click", () => {

        listItems.forEach(x => x.classList.remove("active"));
        li.classList.add("active");

        const c = circuits[li.dataset.key];

        nameEl.textContent = c.name;
        imgEl.src = c.image;
        imgEl.classList.remove("active");
        setTimeout(() => imgEl.classList.add("active"), 50);

        statsEl.innerHTML = `
            <p><strong>Country:</strong> ${c.country}</p>
            <p><strong>Races Held:</strong> ${c.races}</p>
            <p><strong>Lap Record:</strong> ${c.lap}</p>
        `;

        pin.style.left = c.map.x;
        pin.style.top = c.map.y;
    });
});
