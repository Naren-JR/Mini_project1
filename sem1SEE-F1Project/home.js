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

/* =============================
   INTERACTIVE LIVE TELEMETRY
============================= */

(function () {

const $ = s => document.querySelector(s);

let speed = 0;
let rpm = 0;
let gear = "N";
let engineRunning = false;

const speedEl = $("#speedVal");
const rpmEl = $("#rpmVal");
const gearEl = $("#gearVal");
const throttle = $("#throttleInput");
const needle = $("#needleGroup");

const teamSelect = $("#teamSelect");
const presetSelect = $("#soundPreset");
const rampSelect = $("#rampSelect");
const timingSelect = $("#timingPreset");

const startBtn = $("#startBtn");
const stopBtn = $("#stopBtn");
const resetBtn = $("#resetBtn");

let audioCtx = null, osc = null, noise = null, filter = null, master = null;

const TEAMS = {
    mclaren:  { max: 345, torque: 1.0, gears: 8 },
    ferrari:  { max: 350, torque: 1.1, gears: 8 },
    redbull:  { max: 360, torque: 1.2, gears: 8 },
    mercedes: { max: 355, torque: 1.15, gears: 8 }
};

const PRESETS = {
    standard: { base: 80, noise: 0.3, q: 5 },
    v8:       { base: 65, noise: 0.5, q: 7 },
    v6:       { base: 100, noise: 0.25, q: 4 },
    electric: { base: 250, noise: 0.05, q: 2 }
};

const RAMP = {
    gentle: 0.4,
    normal: 0.8,
    fast:   1.4
};

const TIMING = {
    relaxed: 0.6,
    standard: 1.0,
    aggressive: 1.6
};


/* ========= Build Speed Ticks =========== */

(function buildTicks() {
    const g = document.getElementById("ticks");
    for (let i = 0; i <= 12; i++) {
        const angle = -90 + (i * 180/12);
        const x1 = 100 + Math.cos(angle * Math.PI/180)*70;
        const y1 = 100 + Math.sin(angle * Math.PI/180)*70;
        const x2 = 100 + Math.cos(angle * Math.PI/180)*60;
        const y2 = 100 + Math.sin(angle * Math.PI/180)*60;

        const ln = document.createElementNS("http://www.w3.org/2000/svg","line");
        ln.setAttribute("x1",x1);
        ln.setAttribute("y1",y1);
        ln.setAttribute("x2",x2);
        ln.setAttribute("y2",y2);
        ln.setAttribute("stroke","#aaa");
        ln.setAttribute("stroke-width", i % 3 === 0 ? 2 : 1);
        g.appendChild(ln);

        if (i % 2 === 0) {
            const tx = 100 + Math.cos(angle * Math.PI/180)*48;
            const ty = 100 + Math.sin(angle * Math.PI/180)*48 + 3;

            const label = document.createElementNS("http://www.w3.org/2000/svg","text");
            label.setAttribute("x",tx);
            label.setAttribute("y",ty);
            label.setAttribute("fill","#ccc");
            label.setAttribute("font-size","10");
            label.setAttribute("text-anchor","middle");
            label.textContent = Math.round((i/12)*360);
            g.appendChild(label);
        }
    }
})();


/* ========== Audio Setup ========== */

function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    osc = audioCtx.createOscillator();
    osc.type = "sawtooth";

    filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";

    let buff = audioCtx.createBuffer(1, audioCtx.sampleRate*2, audioCtx.sampleRate);
    let data = buff.getChannelData(0);
    for (let i=0;i<data.length;i++) data[i] = Math.random()*2-1;

    let noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buff;
    noiseSource.loop = true;

    noise = audioCtx.createGain();
    master = audioCtx.createGain();

    noiseSource.connect(noise);
    osc.connect(filter);
    filter.connect(master);
    noise.connect(master);
    master.connect(audioCtx.destination);

    osc.start();
    noiseSource.start();
}


/* ========== Speed → RPM Mapping ========== */
function speedToRPM(v, max) {
    return Math.round((v/max) * 14000);
}

/* ========== RPM → Engine Frequency ========== */
function rpmToFreq(rpm, preset) {
    const p = PRESETS[preset];
    return p.base + (rpm/14000)*(p.base*6);
}


/* ========== Telemetry Loop ========== */
let lastTime = null;

function loop(ts) {
    if (!lastTime) lastTime = ts;
    const dt = (ts - lastTime)/1000;
    lastTime = ts;

    const t = throttle.value / 100;
    const team = TEAMS[teamSelect.value];
    const preset = PRESETS[presetSelect.value];
    const ramp = RAMP[rampSelect.value];
    const timing = TIMING[timingSelect.value];

    const target = t * team.max * timing;
    speed += (target - speed) * dt * team.torque * ramp;
    if (speed < 0.1) speed = 0;

    rpm = speedToRPM(speed, team.max);

    if (speed < 5) gear = "N";
    else gear = Math.min(team.gears, Math.ceil(rpm/2000));

    speedEl.textContent = Math.round(speed);
    rpmEl.textContent = rpm;
    gearEl.textContent = gear;

    const angle = (speed/team.max)*180 - 90;
    needle.style.transform = `translate(100px,100px) rotate(${angle}deg)`;

    /* AUDIO UPDATE */
    const f = rpmToFreq(rpm, presetSelect.value);
    filter.frequency.setTargetAtTime(f*1.5, audioCtx.currentTime, 0.05);
    filter.Q.setTargetAtTime(preset.q, audioCtx.currentTime, 0.05);
    noise.gain.setTargetAtTime(preset.noise * (t+0.1), audioCtx.currentTime, 0.03);
    master.gain.setTargetAtTime(Math.min(0.7, t + rpm/15000), audioCtx.currentTime, 0.03);
    osc.frequency.setTargetAtTime(f, audioCtx.currentTime, 0.03);

    if (engineRunning) requestAnimationFrame(loop);
}

/* ========== Stopwatch ========== */
let startTime = 0, swRunning = false;

function updateStopwatch() {
    if (!swRunning) return;
    const now = performance.now() - startTime;

    const m = Math.floor(now/60000);
    const s = Math.floor((now%60000)/1000);
    const cs = Math.floor((now%1000)/10);

    $("#stopwatch").textContent =
        `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(cs).padStart(2,'0')}`;

    requestAnimationFrame(updateStopwatch);
}

/* ========== BUTTONS ========== */

startBtn.addEventListener("click", () => {
    if (!audioCtx) initAudio();
    audioCtx.resume();

    engineRunning = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;

    speed = 0;

    lastTime = null;
    requestAnimationFrame(loop);

    swRunning = true;
    startTime = performance.now();
    requestAnimationFrame(updateStopwatch);
});

stopBtn.addEventListener("click", () => {
    engineRunning = false;
    stopBtn.disabled = true;
    startBtn.disabled = false;

    master.gain.setTargetAtTime(0.001, audioCtx.currentTime, 0.2);
    swRunning = false;
});

resetBtn.addEventListener("click", () => {
    speed = 0;
    rpm = 0;
    speedEl.textContent = "0";
    rpmEl.textContent = "0";
    gearEl.textContent = "N";
    needle.style.transform = `translate(100px,100px) rotate(-90deg)`;

    $("#stopwatch").textContent = "00:00.00";
    swRunning = false;
});


})();
