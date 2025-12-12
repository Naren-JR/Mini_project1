/* ===============================
   NAVBAR HIGHLIGHT
   =============================== */
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

/* ===========================================================
   TELEMETRY ENGINE — ARC (static) + DIGITAL SPEED
   Smooth throttle, RPM mapping, engine + gearshift sounds
   =========================================================== */
(function () {
  const $ = s => document.querySelector(s);

  /* DOM */
  const speedEl = $("#speedVal");
  const rpmEl   = $("#rpmVal");
  const gearEl  = $("#gearVal");
  const throttle = $("#throttleInput");

  const teamSel   = $("#teamSelect");
  const presetSel = $("#soundPreset");
  const rampSel   = $("#rampSelect");
  const timingSel = $("#timingPreset");

  const startBtn = $("#startBtn");
  const stopBtn  = $("#stopBtn");
  const resetBtn = $("#resetBtn");

  /* engine state */
  let speed = 0;            // km/h
  let rpm = 0;
  let gear = "N";
  let engineRunning = false;
  let lastFrame = null;

  const MAX_SPEED = 400;    // limit

  /* team performance (simple tuning knobs) */
  const TEAMS = {
    mclaren:  { torque: 1.05, gears: 8 },
    redbull:  { torque: 1.25, gears: 8 },
    ferrari:  { torque: 1.10, gears: 8 },
    mercedes: { torque: 1.12, gears: 8 }
  };

  /* audio presets */
  const PRESETS = {
    standard: { base: 100, noise: 0.25, q: 6 },
    v8:       { base: 70, noise: 0.45, q: 8 },
    v6:       { base: 120, noise: 0.2, q: 5 },
    electric: { base: 260, noise: 0.02, q: 2 }
  };

  const RAMP = { gentle: 0.45, normal: 0.85, fast: 1.6 };
  const TIMING = { relaxed: 0.6, standard: 1.0, aggressive: 1.6 };

  /* audio nodes */
  let audioCtx = null, osc = null, filter = null, noiseGen = null, noiseGain = null, master = null;

function playGearshift() {
    if (!audioCtx) return;

    /* --------------------------------------------------------
       GEARSHIFT SOUND = 3 PARTS
       1) "Tut"      → quick mechanical click
       2) "Thump"    → gearbox impact
       3) "Crack + Pshhh" → exhaust backfire + wastegate
       -------------------------------------------------------- */

    // 1) Tut — short square click
    const tutOsc = audioCtx.createOscillator();
    const tutGain = audioCtx.createGain();
    tutOsc.type = "square";
    tutOsc.frequency.value = 900;
    tutGain.gain.value = 0.001;
    tutOsc.connect(tutGain).connect(audioCtx.destination);
    tutGain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.05);
    tutOsc.start();
    tutOsc.stop(audioCtx.currentTime + 0.06);

    // 2) Thump — low sine punch
    const thumpOsc = audioCtx.createOscillator();
    const thumpGain = audioCtx.createGain();
    thumpOsc.type = "sine";
    thumpOsc.frequency.value = 55;
    thumpGain.gain.value = 1.1;
    thumpOsc.connect(thumpGain).connect(audioCtx.destination);
    thumpGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
    thumpOsc.start();
    thumpOsc.stop(audioCtx.currentTime + 0.16);

    // 3) Crack + Pshhh — white noise burst
    const crackBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.18, audioCtx.sampleRate);
    const crack = crackBuffer.getChannelData(0);

    // Create white noise with fading envelope
    for (let i = 0; i < crack.length; i++) {
        crack[i] = (Math.random() * 2 - 1) * (1 - i / crack.length);
    }

    const crackSource = audioCtx.createBufferSource();
    crackSource.buffer = crackBuffer;

    const crackGain = audioCtx.createGain();
    crackGain.gain.value = 1.5;
    crackGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);

    crackSource.connect(crackGain).connect(audioCtx.destination);
    crackSource.start();
}

   
  /* -------------------------
     SOUND: burnout (tyre screech)
     ------------------------- */
function playBurnout() {
    if (!audioCtx) return;

    const len = audioCtx.sampleRate * 0.5; // 0.5 seconds
    const buffer = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    // white noise → fades out slowly
    for (let i = 0; i < len; i++) {
        const fade = 1 - i / len;
        data[i] = (Math.random() * 2 - 1) * fade * 1.4;
    }

    const src = audioCtx.createBufferSource();
    src.buffer = buffer;

    const gain = audioCtx.createGain();
    gain.gain.value = 1.4;
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

    src.connect(gain).connect(audioCtx.destination);
    src.start();
}

  /* initialize audio engine (oscillator + noise) */
  function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    osc = audioCtx.createOscillator();
    osc.type = "sawtooth";

    filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";

    const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 2, audioCtx.sampleRate);
    const out = noiseBuffer.getChannelData(0);
    for (let i = 0; i < out.length; i++) out[i] = (Math.random() * 2 - 1) * 0.5;

    noiseGen = audioCtx.createBufferSource();
    noiseGen.buffer = noiseBuffer;
    noiseGen.loop = true;

    noiseGain = audioCtx.createGain();
    master = audioCtx.createGain();

    noiseGen.connect(noiseGain);
    osc.connect(filter);
    filter.connect(master);
    noiseGain.connect(master);
    master.connect(audioCtx.destination);

    osc.start();
    noiseGen.start();
  }

  /* helpers: speed->rpm and rpm->freq */
  function speedToRPM(s) { return Math.round((s / MAX_SPEED) * 14000); }
  function rpmToFreq(rpm, presetName) {
    const p = PRESETS[presetName] || PRESETS.standard;
    return p.base + (rpm / 14000) * (p.base * 6.5);
  }

  /* smoothing helpers to avoid throttle jitter */
  let smoothedThrottle = 0;
  const THROTTLE_SMOOTH = 0.12; // lower = snappier, higher = smoother

  /* main telemetry loop */
  function updateTelemetry(ts) {
    if (!lastFrame) lastFrame = ts;
    const dt = Math.min(0.06, (ts - lastFrame) / 1000); // clamp dt to avoid big jumps
    lastFrame = ts;

    // smooth throttle
    const rawThrottle = Number(throttle.value) / 100;
    smoothedThrottle += (rawThrottle - smoothedThrottle) * Math.min(1, THROTTLE_SMOOTH * (1 / Math.max(dt, 0.0001)));

    const team = TEAMS[teamSel.value] || TEAMS.mclaren;
    const ramp = RAMP[rampSel.value] || RAMP.normal;
    const timing = TIMING[timingSel.value] || TIMING.standard;

    const targetSpeed = smoothedThrottle * MAX_SPEED * timing;
    const accel = team.torque * ramp * (0.9 + smoothedThrottle * 0.5);

    // integrate speed smoothly
    const diff = targetSpeed - speed;
    speed += diff * accel * dt;
    if (speed < 0.01) speed = 0;

    // rpm mapping
    rpm = speedToRPM(speed);

    // gear logic
    const gearCalc = Math.ceil((rpm / 14000) * team.gears);
    const newGear = speed < 5 ? "N" : Math.min(team.gears, Math.max(1, gearCalc));

    if (newGear !== gear) {
      // if we shifted up (not from N), play gearshift sequence
      if (gear !== "N") playGearshift();
      gear = newGear;
    }

    // update UI
    speedEl.textContent = Math.round(speed);
    rpmEl.textContent = rpm;
    gearEl.textContent = gear;

    // audio modulation
    if (audioCtx) {
      const freq = rpmToFreq(rpm, presetSel.value);
      osc.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.03);
      filter.frequency.setTargetAtTime(freq * 1.4 + 300, audioCtx.currentTime, 0.06);

      const preset = PRESETS[presetSel.value] || PRESETS.standard;
      noiseGain.gain.setTargetAtTime(preset.noise * (0.2 + smoothedThrottle * 0.9), audioCtx.currentTime, 0.04);
      master.gain.setTargetAtTime(Math.min(1, 0.08 + smoothedThrottle * 0.9 + rpm / 22000), audioCtx.currentTime, 0.05);
    }

    if (engineRunning) requestAnimationFrame(updateTelemetry);
  }

  /* stopwatch */
  let stopwatchStart = 0, stopwatchRunning = false;
  function updateStopwatch() {
    if (!stopwatchRunning) return;
    const elapsed = performance.now() - stopwatchStart;
    const m = Math.floor(elapsed / 60000);
    const s = Math.floor((elapsed % 60000) / 1000);
    const cs = Math.floor((elapsed % 1000) / 10);
    $("#stopwatch").textContent = `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}.${String(cs).padStart(2,"0")}`;
    requestAnimationFrame(updateStopwatch);
  }

  /* buttons */
  startBtn.addEventListener("click", () => {
    initAudio();
    audioCtx.resume();

    engineRunning = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;

    // burnout if throttle already high
    if (Number(throttle.value) >= 30) playBurnout();

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
    speed = 0; rpm = 0; gear = "N";
    speedEl.textContent = 0; rpmEl.textContent = 0; gearEl.textContent = "N";
    smoothedThrottle = 0;
    stopwatchRunning = false;
    $("#stopwatch").textContent = "00:00.00";
  });

  // initialize audio nodes variables used above
  // (we need noiseGain reference; created in initAudio)
  // note: initAudio lazy-creates nodes when user starts engine

})(); /* end telemetry IIFE */

/* ===========================================================
   TEAM INFO PANEL — buttons + card update
   (keeps same behavior; highlights active)
   =========================================================== */
(function teamPanel(){
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
        specs: ["Turbo-Hybrid V6", "Ferrari ERS", "High Downforce", "Top Speed: 350 km/h"]
    },
    mercedes: {
        name: "Mercedes-AMG Petronas",
        drivers: ["Lewis Hamilton", "George Russell"],
        principal: "Toto Wolff",
        engine: "Mercedes PU106B",
        car: "W16",
        colors: "#00D2BE",
        specs: ["Hybrid V6", "Efficient ERS", "Zero-Pod Aero", "Top Speed: 350 km/h"]
    },
    mclaren: {
        name: "McLaren F1 Team",
        drivers: ["Lando Norris", "Oscar Piastri"],
        principal: "Andrea Stella",
        engine: "Mercedes PU",
        car: "MCL38",
        colors: "#FF8700",
        specs: ["Turbo-Hybrid V6", "ERS Mercedes", "Papaya Aero", "Top Speed: 348 km/h"]
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

  const buttons = document.querySelectorAll(".team-buttons button");
  const card = document.getElementById("teamCard");

  if (!buttons || !card) return;

  buttons.forEach(b=>{
    b.addEventListener("click", ()=>{
      buttons.forEach(x=>x.classList.remove("active-team"));
      b.classList.add("active-team");
      const key = b.dataset.team;
      const t = TEAM_DATA[key];
      if (!t) return;
      card.innerHTML = `
        <h3>${t.name}</h3>
        <div class="section-title">Drivers</div><p>${t.drivers.join(", ")}</p>
        <div class="section-title">Car</div><p>${t.car}</p>
        <div class="section-title">Engine</div><p>${t.engine}</p>
        <div class="section-title">Principal</div><p>${t.principal}</p>
        <div class="section-title">Specs</div><ul>${t.specs.map(s=>`<li>${s}</li>`).join("")}</ul>
      `;
      card.style.backgroundColor = t.colors + "CC";
      card.style.borderColor = t.colors;
    });
  });

})(); /* end team panel */
