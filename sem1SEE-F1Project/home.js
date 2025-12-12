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
   UPDATED ADVANCED TELEMETRY ENGINE (WITH GEARSHIFT + BURNOUT)
   =========================================================== */

(function () {

const $ = s => document.querySelector(s);

/* DOM */
const speedEl = $("#speedVal");
const rpmEl = $("#rpmVal");
const gearEl = $("#gearVal");
const throttle = $("#throttleInput");
const needle = $("#needleGroup");

const teamSel = $("#teamSelect");
const presetSel = $("#soundPreset");
const rampSel = $("#rampSelect");
const timingSel = $("#timingPreset");

const startBtn = $("#startBtn");
const stopBtn = $("#stopBtn");
const resetBtn = $("#resetBtn");

/* Engine */
let speed = 0;
let rpm = 0;
let gear = "N";
let engineRunning = false;

/* Performance timing */
let lastFrame = null;

const MAX_SPEED = 400;
const TEAMS = {
    mclaren:  { torque: 1.05, gears: 8 },
    redbull:  { torque: 3.15, gears: 8 },
    ferrari:  { torque: 1.10, gears: 8 },
    mercedes: { torque: 1.12, gears: 8 }
};

/* Sound*/
const PRESETS = {
    standard: { base: 100, noise: 0.3, q: 6 },
    v8:       { base: 70, noise: 0.6, q: 8 },
    v6:       { base: 120, noise: 0.25, q: 5 },
    electric: { base: 260, noise: 0.05, q: 3 }
};

const RAMP = {
    gentle: 0.4,
    normal: 0.8,
    fast:   1.4
};
const TIMING = {
    relaxed: 0.6,
    standard: 1.0,
    aggressive: 1.8
};

/* AUDIO ENGINE */
let audioCtx = null, osc = null, noise = null, noiseGen = null, filter = null, master = null;

/* Special sound bursts */
function playGearshift() {
    if (!audioCtx) return;

    /* --- 1. LOW-FREQUENCY PRESSURE THUMP --- */
    const thumpOsc = audioCtx.createOscillator();
    const thumpGain = audioCtx.createGain();

    thumpOsc.type = "sine";
    thumpOsc.frequency.value = 65;  // deep exhaust resonance
    thumpGain.gain.value = 0.9;

    thumpOsc.connect(thumpGain);
    thumpGain.connect(audioCtx.destination);

    thumpGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

    thumpOsc.start();
    thumpOsc.stop(audioCtx.currentTime + 0.13);

    /* --- 2. EXHAUST CRACK (white noise burst) --- */
    const crackBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.15, audioCtx.sampleRate);
    const crackData = crackBuffer.getChannelData(0);
    for (let i = 0; i < crackData.length; i++) {
        crackData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / crackData.length, 1.8);
    }

    const crackSource = audioCtx.createBufferSource();
    crackSource.buffer = crackBuffer;

    const crackGain = audioCtx.createGain();
    crackGain.gain.value = 1.8; // high power pop
    crackGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

    crackSource.connect(crackGain);
    crackGain.connect(audioCtx.destination);

    crackSource.start();

    /* --- 3. SHORT “PSHH” PRESSURE RELEASE (wastegate-like) --- */
    const gaspBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.20, audioCtx.sampleRate);
    const gaspData = gaspBuffer.getChannelData(0);
    for (let i = 0; i < gaspData.length; i++) {
        gaspData[i] = (Math.random() * 2 - 1) * (0.5 * (1 - i / gaspData.length));
    }

    const gaspSource = audioCtx.createBufferSource();
    gaspSource.buffer = gaspBuffer;

    const gaspGain = audioCtx.createGain();
    gaspGain.gain.value = 0.7;
    gaspGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);

    gaspSource.connect(gaspGain);
    gaspGain.connect(audioCtx.destination);

    gaspSource.start();
}


function playBurnout() {
    if (!audioCtx) return;

    const bufferSize = audioCtx.sampleRate * 0.25;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;

    const gain = audioCtx.createGain();
    gain.gain.value = 1;
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

    source.connect(gain);
    gain.connect(audioCtx.destination);

    source.start();
}

/* INITIALIZE AUDIO NODES */
function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    osc = audioCtx.createOscillator();
    osc.type = "sawtooth";

    filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";

    /* Base engine noise */
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

/* MAP SPEED → RPM */
function speedToRPM(spd) {
    return Math.round((spd / MAX_SPEED) * 14000);
}

/* MAP RPM → FREQUENCY */
function rpmToFreq(rpm, preset) {
    const p = PRESETS[preset];
    return p.base + (rpm / 14000) * (p.base * 6.5);
}

/* MAIN TELEMETRY UPDATE */
function updateTelemetry(t) {
    if (!lastFrame) lastFrame = t;
    const dt = (t - lastFrame) / 1000;
    lastFrame = t;

    const throttleVal = throttle.value / 100;
    const team = TEAMS[teamSel.value];
    const preset = PRESETS[presetSel.value];

    const ramp = RAMP[rampSel.value];
    const timing = TIMING[timingSel.value];

    /* Target speed based on throttle */
    const targetSpeed = throttleVal * MAX_SPEED * timing;

    const acceleration = team.torque * ramp * (0.8 + throttleVal * 0.4);

    /* Smooth acceleration */
    signal = targetSpeed - speed;
    speed += signal * acceleration * dt;

    if (speed < 0.1) speed = 0;

    rpm = speedToRPM(speed);

    /* Gear calculation */
    const g = Math.ceil((rpm / 14000) * team.gears);
    let newGear = speed < 5 ? "N" : Math.min(team.gears, Math.max(1, g));

    if (newGear !== gear) {
        if (gear !== "N") playGearshift(); // gearshift sound
        gear = newGear;
    }

    /* Update UI */
    speedEl.textContent = Math.round(speed);
    rpmEl.textContent = rpm;
    gearEl.textContent = gear;

    /* Need rotation fix */
    const angle = (speed / MAX_SPEED) * 180 - 90;
    needle.style.transform = `translate(100px,100px) rotate(${angle}deg)`;

    /* AUDIO UPDATE */
    if (audioCtx) {
        const freq = rpmToFreq(rpm, presetSel.value);

        osc.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.03);
        filter.frequency.setTargetAtTime(freq * 1.6, audioCtx.currentTime, 0.05);
        filter.Q.setTargetAtTime(preset.q, audioCtx.currentTime, 0.05);

        noise.gain.setTargetAtTime(preset.noise * (throttleVal + 0.2), audioCtx.currentTime, 0.03);
        master.gain.setTargetAtTime(Math.min(0.8, throttleVal + rpm / 15000), audioCtx.currentTime, 0.05);
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

    needle.style.transform = `translate(100px,100px) rotate(-90deg)`;

    stopwatchRunning = false;
    $("#stopwatch").textContent = "00:00.00";
});

})();

/* ==========================================================
      DYNAMIC TEAM INFO PANEL — TEAM DATABASE + LOGIC
   ========================================================== */

const TEAM_DATA = {

    redbull: {
        name: "Red Bull Racing",
        drivers: ["Max Verstappen", "Sergio Pérez"],
        principal: "Christian Horner",
        engine: "Honda RBPT",
        car: "RB21",
        colors: "#1E5BC6",
        specs: [
            "Turbo-Hybrid V6",
            "ERS: 160hp Assist",
            "Weight: 798kg",
            "Top Speed: 355 km/h"
        ]
    },

    mercedes: {
        name: "Mercedes-AMG Petronas",
        drivers: ["Lewis Hamilton", "George Russell"],
        principal: "Toto Wolff",
        engine: "Mercedes PU106B",
        car: "W16",
        colors: "#00D2BE",
        specs: [
            "Turbo-Hybrid V6",
            "Zero-Pod Aero Philosophy",
            "ERS: High Efficiency Unit",
            "Top Speed: 350 km/h"
        ]
    },

    ferrari: {
        name: "Scuderia Ferrari",
        drivers: ["Charles Leclerc", "Carlos Sainz"],
        principal: "Fred Vasseur",
        engine: "Ferrari 066/10",
        car: "SF-25",
        colors: "#DC0000",
        specs: [
            "Turbo-Hybrid V6",
            "ERS: Ferrari MGU-K",
            "Top Speed: 350 km/h",
            "High Downforce Aero"
        ]
    },

    mclaren: {
        name: "McLaren F1 Team",
        drivers: ["Lando Norris", "Oscar Piastri"],
        principal: "Andrea Stella",
        engine: "Mercedes PU",
        car: "MCL38",
        colors: "#FF8700",
        specs: [
            "Turbo-Hybrid V6",
            "Orange Papaya Livery",
            "Top Speed: 348 km/h",
            "ERS: Mercedes System"
        ]
    },

    astonmartin: {
        name: "Aston Martin Aramco",
        drivers: ["Fernando Alonso", "Lance Stroll"],
        principal: "Mike Krack",
        engine: "Mercedes PU",
        car: "AMR25",
        colors: "#006F62",
        specs: [
            "Turbo-Hybrid V6",
            "Green Arrowhead Aero",
            "Top Speed: 347 km/h"
        ]
    },

    rb: {
        name: "Visa CashApp RB",
        drivers: ["Daniel Ricciardo", "Yuki Tsunoda"],
        principal: "Laurent Mekies",
        engine: "Honda RBPT",
        car: "VCARB 01",
        colors: "#2B2D42",
        specs: [
            "Turbo-Hybrid V6",
            "Sister Team to Red Bull",
            "Top Speed: 344 km/h"
        ]
    },

    haas: {
        name: "Haas F1 Team",
        drivers: ["Nico Hülkenberg", "Kevin Magnussen"],
        principal: "Ayao Komatsu",
        engine: "Ferrari PU",
        car: "VF-25",
        colors: "#B7B7B7",
        specs: [
            "Turbo-Hybrid V6",
            "Budget-Limited Aero",
            "Top Speed: 340 km/h"
        ]
    },

    williams: {
        name: "Williams Racing",
        drivers: ["Alex Albon", "Logan Sargeant"],
        principal: "James Vowles",
        engine: "Mercedes PU",
        car: "FW47",
        colors: "#005AFF",
        specs: [
            "Turbo-Hybrid V6",
            "Blue Premium Aero",
            "Top Speed: 346 km/h"
        ]
    },

    sauber: {
        name: "Stake F1 Team Kick Sauber",
        drivers: ["Valtteri Bottas", "Zhou Guanyu"],
        principal: "Andreas Seidl",
        engine: "Ferrari PU",
        car: "C45",
        colors: "#00FF9D",
        specs: [
            "Turbo-Hybrid V6",
            "Green/Black Livery",
            "Top Speed: 343 km/h"
        ]
    },

    alpine: {
        name: "Alpine F1 Team",
        drivers: ["Pierre Gasly", "Esteban Ocon"],
        principal: "Bruno Famin",
        engine: "Renault E-Tech",
        car: "A525",
        colors: "#0090FF",
        specs: [
            "Turbo-Hybrid V6",
            "French Racing Blue",
            "Top Speed: 345 km/h"
        ]
    }
};


/* HANDLE BUTTON CLICKS */
const teamButtons = document.querySelectorAll(".team-buttons button");
const teamCard = document.getElementById("teamCard");

teamButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const key = btn.dataset.team;
        const t = TEAM_DATA[key];

        if (!t) return;

        /* Update card content */
        teamCard.innerHTML = `
            <h3>${t.name}</h3>
            <p><strong>Drivers:</strong> ${t.drivers.join(", ")}</p>
            <p><strong>Engine:</strong> ${t.engine}</p>
            <p><strong>Car:</strong> ${t.car}</p>
            <p><strong>Team Principal:</strong> ${t.principal}</p>
            <p><strong>Specs:</strong></p>
            <ul>
                ${t.specs.map(s => `<li>${s}</li>`).join("")}
            </ul>
        `;

        /* Team color animation */
        teamCard.style.backgroundColor = t.colors;
        teamCard.style.borderColor = t.colors;
    });
});

