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

/* ===================== */
/* LIVE SPEED + RPM SIM  */
/* ===================== */

let speed = 0;
let rpmArc = document.getElementById("rpmArc");
let speedDisplay = document.getElementById("speedDisplay");
let simRunning = false;

document.getElementById("startSim").onclick = function () {
    if (simRunning) return;
    simRunning = true;

    let interval = setInterval(() => {
        if (speed >= 320) {
            clearInterval(interval);
            simRunning = false;
            return;
        }
        speed += 4;
        speedDisplay.textContent = speed + " km/h";

        // RPM arc animation
        let progress = (speed / 320) * 440;
        rpmArc.style.strokeDashoffset = (440 - progress);

    }, 60);
};

/* ===================== */
/* NEXT RACE COUNTDOWN   */
/* ===================== */

function updateCountdown() {
    let raceDate = new Date("March 3, 2025 20:30:00").getTime();
    let now = Date.now();
    let diff = raceDate - now;

    if (diff <= 0) return;

    document.getElementById("d").textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
    document.getElementById("h").textContent = Math.floor(diff / (1000 * 60 * 60) % 24);
    document.getElementById("m").textContent = Math.floor(diff / (1000 * 60) % 60);
    document.getElementById("s").textContent = Math.floor(diff / 1000 % 60);
}

setInterval(updateCountdown, 1000);
updateCountdown();

