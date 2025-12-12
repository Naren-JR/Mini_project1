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


/* ===========================================================
   CLEAN DIGITAL TELEMETRY (NO NEEDLE)
   =========================================================== */

(function () {

const $ = s => document.querySelector(s);

/* DOM */
const speedEl = $("#speedVal");
const rpmEl = $("#rpmVal");
const gearEl = $("#gearVal");
const throttle = $("#throttleInput");

const teamSel = $("#teamSelect");
const presetSel = $("#soundPreset");
const rampSel = $("#rampSelect");
const timingSel = $("#timingPreset");

const startBtn = $("#startBtn");
const stopBtn = $("#stopBtn");
const resetBtn = $("#resetBtn");

const revFill = document.getElementById("revFill");

/* Engine */
let speed = 0;
let rpm = 0;
let gear = "N";
let engineRunning = false;

let lastFrame = null;

const MAX_SPEED = 400;

/* Team torque settings */
const TEAMS = {
    mclaren:  { torque: 1.05, gears: 8 },
    redbull:  { torque: 1.25, gears: 8 },
    ferrari:  { torque: 1.10, gears: 8 },
    mercedes: { torque: 1.12, gears: 8 }
};

/* Sound presets */
const PRESETS = {
    standard: { base: 100, noise: 0.3, q: 6 },
    v8:       { base: 70, noise: 0.6, q: 8 },
    v6:       { base: 120, noise: 0.25, q: 5 },
    electric: { base: 260, noise: 0.05, q: 3 }
};

/* Ramp/Timing */
const RAMP = { gentle: 0.4, normal: 0.8, fast: 1.4 };
const TIMING = { relaxed: 0.6, standard: 1.0, aggressive: 1.8 };

/* Audio engine objects */
let audioCtx = null, osc = null, noise = null, noiseGen = null, filter = null, master = null;

/* GEARSHIFT SOUND */
function playGearshift() {
    if (!audioCtx) return;

    // deep thump
    const thump = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    thump.type = "sine";
    thump.frequency.value = 70;
    gain.gain.value = 0.9;
    thump.connect(gain);
    gain.connect(audioCtx.destination);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    thump.start();
    thump.stop(audioCtx.currentTime + 0.12);
}

/* BURNOUT SOUND */
function playBurnout() {
    if (!audioCtx) return;

    const bufferSize = audioCtx.sampleRate * 0.2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++)
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);

    const src = audioCtx.createBufferSource();
    src.buffer = buffer;

    const g = audioCtx.createGain();
    g.gain.value = 1;
    g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

    src.connect(g);
    g.connect(audioCtx.destination);
    src.start();
}

/* AUDIO INIT */
function initAudio() {
    audioCtx = new AudioContext();

    osc = audioCtx.createOscillator();
    filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";

    // noise generator
    const buff = audioCtx.createBuffer(1, audioCtx.sampleRate * 2, audioCtx.sampleRate);
    const arr = buff.getChannelData(0);
    for (let i = 0; i < arr.length; i++) arr[i] = Math.random() * 2 - 1;

    noiseGen = audioCtx.createBufferSource();
    noiseGen.buffer = buff;
    noiseGen.loop = true;

    noise = audioCtx.createGain();
    master = audioCtx.createGain();

    noiseGen.connect(noise);
    osc.connect(filter);
    filter.connect(master);
    noise.connect(master);
    master.connect(audioCtx.destination);

    osc.type = "sawtooth";
    osc.start();
    noiseGen.start();
}

/* SPEED → RPM */
function speedToRPM(sp) { return Math.round((sp / MAX_SPEED) * 14000); }

/* RPM → FREQ */
function rpmToFreq(rpm, preset) {
    const p = PRESETS[preset];
    return p.base + (rpm / 14000) * (p.base * 6);
}

/* MAIN LOOP */
function updateTelemetry(t) {
    if (!lastFrame) lastFrame = t;
    const dt = (t - lastFrame) / 1000;
    lastFrame = t;

    const throttleVal = throttle.value / 100;
    const team = TEAMS[teamSel.value];
    const preset = PRESETS[presetSel.value];

    const ramp = RAMP[rampSel.value];
    const timing = TIMING[timingSel.value];

    const targetSpeed = throttleVal * MAX_SPEED * timing;
    const accel = team.torque * ramp;

    speed += (targetSpeed - speed) * accel * dt;
    if (speed < 0.1) speed = 0;

    rpm = speedToRPM(speed);

    // gear calculation
    const g = Math.ceil((rpm / 14000) * team.gears);
    let newGear = speed < 5 ? "N" : Math.min(team.gears, Math.max(1, g));
    if (newGear !== gear && gear !== "N") playGearshift();
    gear = newGear;

    // update UI
    speedEl.textContent = Math.round(speed);
    rpmEl.textContent = rpm;
    gearEl.textContent = gear;

    // REV BAR UPDATE
    const percent = (rpm / 14000) * 100;
    revFill.style.width = percent + "%";

    if (percent < 40) revFill.style.background = "#00ff00";     // green
    else if (percent < 80) revFill.style.background = "#ffcc00"; // yellow
    else revFill.style.background = "#ff1e00";                   // red

    // AUDIO
    if (audioCtx) {
        const freq = rpmToFreq(rpm, presetSel.value);

        osc.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.03);
        filter.frequency.setTargetAtTime(freq * 1.4, audioCtx.currentTime, 0.04);

        noise.gain.setTargetAtTime(preset.noise * throttleVal, audioCtx.currentTime, 0.03);
        master.gain.setTargetAtTime(Math.min(1, throttleVal + (rpm / 15000)), audioCtx.currentTime, 0.04);
    }

    if (engineRunning) requestAnimationFrame(updateTelemetry);
}

/* STOPWATCH */
let stopwatchStart = 0;
let stopwatchRunning = false;

function updateStopwatch() {
    if (!stopwatchRunning) return;
    const elapsed = performance.now() - stopwatchStart;
    const m = Math.floor(elapsed / 60000);
    const s = Math.floor((elapsed % 60000) / 1000);
    const cs = Math.floor((elapsed % 1000) / 10);

    $("#stopwatch").textContent =
        `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}.${String(cs).padStart(2,"0")}`;

    requestAnimationFrame(updateStopwatch);
}

/* BUTTON HANDLERS */
startBtn.addEventListener("click", () => {
    if (!audioCtx) initAudio();
    audioCtx.resume();

    engineRunning = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;

    if (throttle.value >= 30) playBurnout();

    stopwatchRunning = true;
    stopwatchStart = performance.now();
    requestAnimationFrame(updateStopwatch);

    lastFrame = null;
    requestAnimationFrame(updateTelemetry);
});

stopBtn.addEventListener("click", () => {
    engineRunning = false;
    stopBtn.disabled = true;
    startBtn.disabled = false;

    if (master) master.gain.setTargetAtTime(0.001, audioCtx.currentTime, 0.3);
    stopwatchRunning = false;
});

resetBtn.addEventListener("click", () => {
    speed = 0;
    rpm = 0;
    gear = "N";

    speedEl.textContent = 0;
    rpmEl.textContent = 0;
    gearEl.textContent = "N";
    revFill.style.width = "0%";

    stopwatchRunning = false;
    $("#stopwatch").textContent = "00:00.00";
});

})();


/* STOPWATCH */
let stopwatchStart = 0;
let stopwatchRunning = false;

function updateStopwatch() {
    if (!stopwatchRunning) return;

    const elapsed = performance.now() - stopwatchStart;

    const m = Math.floor(elapsed / 60000);
    const s = Math.floor((elapsed % 60000) / 1000);
    const cs = Math.floor((elapsed % 1000) / 10);

    $("#stopwatch").textContent =
        `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;

    requestAnimationFrame(updateStopwatch);
}

/* BUTTONS */
startBtn.addEventListener("click", () => {
    if (!audioCtx) initAudio();
    audioCtx.resume();

    engineRunning = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;

    /* Burnout sound ONLY if throttle > 30% */
    if (throttle.value >= 30) playBurnout();

    stopwatchRunning = true;
    stopwatchStart = performance.now();
    requestAnimationFrame(updateStopwatch);

    lastFrame = null;
    requestAnimationFrame(updateTelemetry);
});

stopBtn.addEventListener("click", () => {
    engineRunning = false;
    stopBtn.disabled = true;
    startBtn.disabled = false;

    if (master)
        master.gain.setTargetAtTime(0.001, audioCtx.currentTime, 0.3);

    stopwatchRunning = false;
});

resetBtn.addEventListener("click", () => {
    speed = 0;
    rpm = 0;
    gear = "N";

    speedEl.textContent = 0;
    rpmEl.textContent = 0;
    gearEl.textContent = "N";
    stopwatchRunning = false;
    $("#stopwatch").textContent = "00:00.00";
});

})();

/*  CLEAN TEAM INFO PANEL + ACTIVE BUTTON HIGHLIGHT */

const TEAM_DATA = {
    redbull: {
        name: "Red Bull Racing",
        drivers: ["Max Verstappen", "Sergio Pérez"],
        principal: "Christian Horner",
        engine: "Honda RBPT",
        car: "RB21",
        colors: "#1E5BC6",
        specs: ["Turbo-Hybrid V6", "ERS: 160hp Assist", "Weight: 798kg", "Top Speed: 355 km/h"]
    },
    ferrari: {
        name: "Scuderia Ferrari",
        drivers: ["Charles Leclerc", "Carlos Sainz"],
        principal: "Fred Vasseur",
        engine: "Ferrari 066/10",
        car: "SF-25",
        colors: "#DC0000",
        specs: ["Turbo-Hybrid V6", "Ferrari MGU-K ERS", "High Downforce", "Top Speed: 350 km/h"]
    },
    mercedes: {
        name: "Mercedes-AMG Petronas",
        drivers: ["Lewis Hamilton", "George Russell"],
        principal: "Toto Wolff",
        engine: "Mercedes PU106B",
        car: "W16",
        colors: "#00D2BE",
        specs: ["Turbo-Hybrid V6", "Ultra Efficient ERS", "Zero-Pod Aero", "Top Speed: 350 km/h"]
    },
    mclaren: {
        name: "McLaren F1 Team",
        drivers: ["Lando Norris", "Oscar Piastri"],
        principal: "Andrea Stella",
        engine: "Mercedes PU",
        car: "MCL38",
        colors: "#FF8700",
        specs: ["Turbo-Hybrid V6", "ERS: Mercedes", "Papaya Aero", "Top Speed: 348 km/h"]
    },
    astonmartin: {
        name: "Aston Martin Aramco",
        drivers: ["Fernando Alonso", "Lance Stroll"],
        principal: "Mike Krack",
        engine: "Mercedes PU",
        car: "AMR25",
        colors: "#006F62",
        specs: ["Turbo-Hybrid V6", "Green Arrowhead Aero", "Top Speed: 347 km/h"]
    },
    rb: {
        name: "Visa CashApp RB",
        drivers: ["Daniel Ricciardo", "Yuki Tsunoda"],
        principal: "Laurent Mekies",
        engine: "Honda RBPT",
        car: "VCARB 01",
        colors: "#2B2D42",
        specs: ["Turbo-Hybrid V6", "Sister Team to Red Bull", "Top Speed: 344 km/h"]
    },
    haas: {
        name: "Haas F1 Team",
        drivers: ["Nico Hülkenberg", "Kevin Magnussen"],
        principal: "Ayao Komatsu",
        engine: "Ferrari PU",
        car: "VF-25",
        colors: "#B7B7B7",
        specs: ["Turbo-Hybrid V6", "Budget Aero", "Top Speed: 340 km/h"]
    },
    williams: {
        name: "Williams Racing",
        drivers: ["Alex Albon", "Logan Sargeant"],
        principal: "James Vowles",
        engine: "Mercedes PU",
        car: "FW47",
        colors: "#005AFF",
        specs: ["Turbo-Hybrid V6", "Blue Aero Package", "Top Speed: 346 km/h"]
    },
    sauber: {
        name: "Kick Sauber",
        drivers: ["Valtteri Bottas", "Zhou Guanyu"],
        principal: "Andreas Seidl",
        engine: "Ferrari PU",
        car: "C45",
        colors: "#00FF9D",
        specs: ["Turbo-Hybrid V6", "Green/Black Livery", "Top Speed: 343 km/h"]
    },
    alpine: {
        name: "Alpine F1 Team",
        drivers: ["Pierre Gasly", "Esteban Ocon"],
        principal: "Bruno Famin",
        engine: "Renault E-Tech",
        car: "A525",
        colors: "#0090FF",
        specs: ["Turbo-Hybrid V6", "French Aero", "Top Speed: 345 km/h"]
    }
};

const teamButtons = document.querySelectorAll(".team-buttons button");
const teamCard = document.getElementById("teamCard");

teamButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        /* ACTIVE BUTTON HIGHLIGHT */
        teamButtons.forEach(b => b.classList.remove("active-team"));
        btn.classList.add("active-team");

        const team = TEAM_DATA[btn.dataset.team];

        teamCard.innerHTML = `
            <h3>${team.name}</h3>

            <div class="section-title">Drivers</div>
            <p>${team.drivers.join(", ")}</p>

            <div class="section-title">Car</div>
            <p>${team.car}</p>

            <div class="section-title">Engine</div>
            <p>${team.engine}</p>

            <div class="section-title">Team Principal</div>
            <p>${team.principal}</p>

            <div class="section-title">Specifications</div>
            <ul>${team.specs.map(s => `<li>${s}</li>`).join("")}</ul>
        `;

        teamCard.style.backgroundColor = team.colors + "AA"; /* translucent */
        teamCard.style.borderColor = team.colors;
    });
});

