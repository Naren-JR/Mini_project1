/* ===============================
   NAVBAR HIGHLIGHT
=============================== */
let links = document.querySelectorAll("nav button");
let current = window.location.pathname.split("/").pop();

for (let i = 0; i < 5; i++) {
    if (links[i].innerText.toLowerCase() + ".html" === current) {
        let page = document.getElementById(links[i].innerText.toLowerCase());
        page.style.padding = "10px 25px";
        page.style.backgroundColor = "rgba(255, 30, 0, 0.9)";
        page.style.borderRadius = "10px";
    }
}

/* ===========================================================
   TELEMETRY ENGINE — ARC + DIGITAL SPEED
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

/* Engine State */
let speed = 0;
let rpm = 0;
let gear = "N";
let engineRunning = false;
let lastFrame = null;

const MAX_SPEED = 400;

/* Team torque & gear data */
const TEAMS = {
    mclaren:  { torque: 1.05, gears: 8 },
    redbull:  { torque: 3.15, gears: 8 },
    ferrari:  { torque: 1.10, gears: 8 },
    mercedes: { torque: 1.12, gears: 8 }
};

/* Sound profiles */
const PRESETS = {
    standard: { base: 100, noise: 0.3, q: 6 },
    v8:       { base: 70, noise: 0.6, q: 8 },
    v6:       { base: 120, noise: 0.25, q: 5 },
    electric: { base: 260, noise: 0.05, q: 3 }
};

/* Ramp & timing behavior */
const RAMP = { gentle: 0.4, normal: 0.8, fast: 1.4 };
const TIMING = { relaxed: 0.6, standard: 1.0, aggressive: 1.8 };

/* AUDIO ENGINE */
let audioCtx = null, osc = null, noise = null, noiseGen = null, filter = null, master = null;

/* ===========================================================
   RACER VIBES — FULL EXHAUST PACK
   Gearshift: THUMP + CRACK + PSHH
   Burnout: Heavy tyre spin noise
=========================================================== */

function playGearshift() {
    if (!audioCtx) return;

    /* ------------------------
       1. LOW-END GEAR THUMP
    ------------------------ */
    const thumpOsc = audioCtx.createOscillator();
    const thumpGain = audioCtx.createGain();

    thumpOsc.type = "sine";
    thumpOsc.frequency.value = 60;    // deep bass hit
    thumpGain.gain.value = 1.3;       // hard impact

    thumpOsc.connect(thumpGain);
    thumpGain.connect(audioCtx.destination);

    thumpGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.13);

    thumpOsc.start();
    thumpOsc.stop(audioCtx.currentTime + 0.14);

    /* ------------------------
       2. EXHAUST CRACK POP
       (white-noise envelope)
    ------------------------ */
    const crackBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.12, audioCtx.sampleRate);
    const crackData = crackBuffer.getChannelData(0);

    for (let i = 0; i < crackData.length; i++) {
        crackData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / crackData.length, 1.7);
    }

    const crackSource = audioCtx.createBufferSource();
    crackSource.buffer = crackBuffer;

    const crackGain = audioCtx.createGain();
    crackGain.gain.value = 2.0;   // strong punch
    crackGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

    crackSource.connect(crackGain);
    crackGain.connect(audioCtx.destination);

    crackSource.start();

    /* ------------------------
       3. WASTEGATE "PSHHH"
    ------------------------ */
    const gaspBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.22, audioCtx.sampleRate);
    const gaspData = gaspBuffer.getChannelData(0);

    for (let i = 0; i < gaspData.length; i++) {
        gaspData[i] = (Math.random() * 2 - 1) * (0.4 * (1 - i / gaspData.length));
    }

    const gaspSource = audioCtx.createBufferSource();
    gaspSource.buffer = gaspBuffer;

    const gaspGain = audioCtx.createGain();
    gaspGain.gain.value = 0.9;
    gaspGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.19);

    gaspSource.connect(gaspGain);
    gaspGain.connect(audioCtx.destination);

    gaspSource.start();
}

/* ===========================================================
   BURNOUT SOUND — MASSIVE TYRE SPIN NOISE
=========================================================== */
function playBurnout() {
    if (!audioCtx) return;

    const size = audioCtx.sampleRate * 0.55; // half-second burn
    const buffer = audioCtx.createBuffer(1, size, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < size; i++) {
        let white = Math.random() * 2 - 1;
        let fade = Math.pow((1 - i / size), 1.3);
        data[i] = white * fade * 1.4;
    }

    const src = audioCtx.createBufferSource();
    src.buffer = buffer;

    const gain = audioCtx.createGain();
    gain.gain.value = 1.8;  // LOUD tyre screech

    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

    src.connect(gain);
    gain.connect(audioCtx.destination);

    src.start();
}



function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    osc = audioCtx.createOscillator();
    osc.type = "sawtooth";

    filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";

    const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 2, audioCtx.sampleRate);
    const out = noiseBuffer.getChannelData(0);
    for (let i = 0; i < out.length; i++) out[i] = Math.random() * 2 - 1;

    noiseGen = audioCtx.createBufferSource();
    noiseGen.buffer = noiseBuffer;
    noiseGen.loop = true;

    noise = audioCtx.createGain();
    master = audioCtx.createGain();

    noiseGen.connect(noise);
    osc.connect(filter);
    filter.connect(master);
    noise.connect(master);
    master.connect(audioCtx.destination);

    osc.start();
    noiseGen.start();
}

function speedToRPM(s) { return Math.round((s / MAX_SPEED) * 14000); }

function rpmToFreq(rpm, preset) {
    const p = PRESETS[preset];
    return p.base + (rpm / 14000) * p.base * 6.5;
}

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
    const acceleration = team.torque * ramp;

    speed += (targetSpeed - speed) * acceleration * dt;

    if (speed < 0.1) speed = 0;

    rpm = speedToRPM(speed);

    const gearCalc = Math.ceil((rpm / 14000) * team.gears);
    const newGear = speed < 5 ? "N" : Math.min(team.gears, Math.max(1, gearCalc));

    if (newGear !== gear && gear !== "N") playGearshift();

    gear = newGear;

    // UPDATE FRONT-END DISPLAY
    speedEl.textContent = Math.round(speed);
    rpmEl.textContent = rpm;
    gearEl.textContent = gear;

    // SOUND UPDATE
    if (audioCtx) {
        const freq = rpmToFreq(rpm, presetSel.value);

        osc.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.03);
        filter.frequency.setTargetAtTime(freq * 1.6, audioCtx.currentTime, 0.05);
        noise.gain.setTargetAtTime(0.3 * (throttleVal + 0.2), audioCtx.currentTime, 0.03);
        master.gain.setTargetAtTime(Math.min(0.8, throttleVal + rpm / 20000), audioCtx.currentTime, 0.05);
    }

    if (engineRunning) requestAnimationFrame(updateTelemetry);
}

/* STOPWATCH ===================== */

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

/* BUTTONS ======================== */

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

/* ===========================================================
   TEAM INFO PANEL
=========================================================== */

const TEAM_DATA = {
    redbull: {
        name: "Red Bull Racing",
        drivers: ["Max Verstappen", "Sergio Pérez"],
        principal: "Christian Horner",
        engine: "Honda RBPT",
        car: "RB21",
        colors: "#1E5BC6",
        specs: ["Turbo-Hybrid V6", "ERS 160hp", "798kg", "Top Speed: 355 km/h"]
    },
    ferrari: {
        name: "Scuderia Ferrari",
        drivers: ["Charles Leclerc", "Carlos Sainz"],
        principal: "Fred Vasseur",
        engine: "Ferrari 066/10",
        car: "SF-25",
        colors: "#DC0000",
        specs: ["Turbo-Hybrid V6", "Ferrari ERS", "High Downforce", "350 km/h"]
    },
    mercedes: {
        name: "Mercedes-AMG Petronas",
        drivers: ["Hamilton", "Russell"],
        principal: "Toto Wolff",
        engine: "Mercedes PU106B",
        car: "W16",
        colors: "#00D2BE",
        specs: ["Hybrid V6", "Efficient ERS", "Zero-Pod", "350 km/h"]
    },
    mclaren: {
        name: "McLaren",
        drivers: ["Norris", "Piastri"],
        principal: "Andrea Stella",
        engine: "Mercedes PU",
        car: "MCL38",
        colors: "#FF8700",
        specs: ["Hybrid V6", "ERS Mercedes", "348 km/h"]
    },
    astonmartin: {
        name: "Aston Martin",
        drivers: ["Alonso", "Stroll"],
        principal: "Mike Krack",
        engine: "Mercedes PU",
        car: "AMR25",
        colors: "#006F62",
        specs: ["Hybrid V6", "347 km/h"]
    },
    rb: {
        name: "Visa CashApp RB",
        drivers: ["Ricciardo", "Tsunoda"],
        principal: "Laurent Mekies",
        engine: "Honda RBPT",
        car: "VCARB-01",
        colors: "#2B2D42",
        specs: ["Hybrid V6", "344 km/h"]
    },
    haas: {
        name: "Haas F1 Team",
        drivers: ["Hülkenberg", "Magnussen"],
        principal: "Ayao Komatsu",
        engine: "Ferrari PU",
        car: "VF-25",
        colors: "#B7B7B7",
        specs: ["Hybrid V6", "340 km/h"]
    },
    williams: {
        name: "Williams",
        drivers: ["Albon", "Sargeant"],
        principal: "James Vowles",
        engine: "Mercedes PU",
        car: "FW47",
        colors: "#005AFF",
        specs: ["Hybrid V6", "346 km/h"]
    },
    sauber: {
        name: "Kick Sauber",
        drivers: ["Bottas", "Zhou"],
        principal: "Andreas Seidl",
        engine: "Ferrari PU",
        car: "C45",
        colors: "#00FF9D",
        specs: ["Hybrid V6", "343 km/h"]
    },
    alpine: {
        name: "Alpine",
        drivers: ["Gasly", "Ocon"],
        principal: "Bruno Famin",
        engine: "Renault E-Tech",
        car: "A525",
        colors: "#0090FF",
        specs: ["Hybrid V6", "345 km/h"]
    }
};

const teamButtons = document.querySelectorAll(".team-buttons button");
const teamCard = document.getElementById("teamCard");

teamButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        teamButtons.forEach(b => b.classList.remove("active-team"));
        btn.classList.add("active-team");

        const t = TEAM_DATA[btn.dataset.team];

        teamCard.innerHTML = `
            <h3>${t.name}</h3>

            <div class="section-title">Drivers</div>
            <p>${t.drivers.join(", ")}</p>

            <div class="section-title">Car</div>
            <p>${t.car}</p>

            <div class="section-title">Engine</div>
            <p>${t.engine}</p>

            <div class="section-title">Team Principal</div>
            <p>${t.principal}</p>

            <div class="section-title">Specifications</div>
            <ul>${t.specs.map(x => `<li>${x}</li>`).join("")}</ul>
        `;

        teamCard.style.backgroundColor = t.colors + "AA";
        teamCard.style.borderColor = t.colors;
    });
});
