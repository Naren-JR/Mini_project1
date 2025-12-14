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
const CIRCUITS = {
    monza: {
        name: "Autodromo Nazionale di Monza",
        country: "Italy",
        races: 74,
        lap: "1:21.046",
        image: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Monza_track_map.svg"
    },
    silverstone: {
        name: "Silverstone Circuit",
        country: "United Kingdom",
        races: 58,
        lap: "1:27.097",
        image: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Silverstone_Circuit_moto_intl_pits.svg"
    },
    spa: {
        name: "Circuit de Spa-Francorchamps",
        country: "Belgium",
        races: 55,
        lap: "1:46.286",
        image: "https://upload.wikimedia.org/wikipedia/commons/5/54/Spa-Francorchamps_of_Belgium.svg"
    },
    monaco: {
        name: "Circuit de Monaco",
        country: "Monaco",
        races: 69,
        lap: "1:12.909",
        image: "https://upload.wikimedia.org/wikipedia/commons/3/36/Monte_Carlo_Formula_1_track_map.svg"
    },
    suzuka: {
        name: "Suzuka Circuit",
        country: "Japan",
        races: 35,
        lap: "1:30.983",
        image: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Suzuka_circuit_map--2005.svg"
    },
    interlagos: {
        name: "Interlagos",
        country: "Brazil",
        races: 50,
        lap: "1:10.540",
        image: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Circuit_Interlagos_1977.svg"
    },
    melbourne: {
        name: "Albert Park Circuit",
        country: "Australia",
        races: 26,
        lap: "1:20.235",
        image: "https://upload.wikimedia.org/wikipedia/commons/1/15/Albert_Park_Circuit_2021.svg"
    },
    bahrain: {
        name: "Bahrain International Circuit",
        country: "Bahrain",
        races: 21,
        lap: "1:31.447",
        image: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Bahrain_International_Circuit--Grand_Prix_Layout.svg"
    }
};

const buttons = document.querySelectorAll(".circuit-buttons button");
const nameEl = document.getElementById("circuitName");
const imgEl = document.getElementById("circuitImage");
const infoEl = document.getElementById("circuitInfo");

buttons.forEach(btn => {
    btn.addEventListener("click", () => {

        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const data = CIRCUITS[btn.dataset.track];
        if (!data) return;

        nameEl.textContent = data.name;

        imgEl.classList.remove("show");
        imgEl.src = data.image;
        imgEl.classList.add("show");


        infoEl.innerHTML = `
            <p><strong>Country:</strong> ${data.country}</p>
            <p><strong>Races Held:</strong> ${data.races}</p>
            <p><strong>Lap Record:</strong> ${data.lap}</p>
        `;
    });
});
