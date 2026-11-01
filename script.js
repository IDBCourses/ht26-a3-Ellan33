/*
 * IDB Programming: A3 — a musical instrument
 *
 * All of the code for your instrument goes in this file. It's split into sections:
 *   settings — the "fixed" parts of your program
 *   state    — the parts of your program that change over time
 *   sound    — the Tone.js instruments and effects
 *   update   — updates the state every 100ms, if necessary
 *   use      — uses the state to make sound and shapes every 100ms, if necessary
 *   controls — what happens when the player uses the pointer
 *   setup    — starts everything
 *
 * The pointer events change the state. update() and use() each run every
 * 100ms, in a loop:
 *   1. update: change the state, e.g. based on time or on the pointer's movement
 *   2. use:    make sound and move shapes, based on the state
 *
 * Shapes come from shape.js: createShape() makes one, and its methods
 * (setPosition, setSize, setColour ...) change it.
 *
 * Tone.js documentation: https://tonejs.github.io/docs/15.1.22/
 */

import { createShape } from "./shape.js";

// ---------- Settings ----------

const saturnNotes = ["C3", "D3", "E3", "F3", "G3", "A3", "B3"];
const marsNotes = ["C2", "D2", "E2", "F2"];
const neptuneNotes = ["C4", "E4", "G4", "B4"];
// ---------- State ----------

//pointerMove
let speed = [];
let previousTime = 0;
let previousX = 0;
let previousY = 0;
let mouseSpeed = 0;

//neptune
let keepPlayingNeptune = false;
//neptuneNotes 1-4
let keepPlayingNeptuneNote1 = false;
let keepPlayingNeptuneNote2 = false;
let keepPlayingNeptuneNote3 = false;
let keepPlayingNeptuneNote4 = false;

//mars
let marsIndex = 0;
let drumInterval = null;
let i = 0;
let playingNote = null;

//saturn
let keepPlayingSaturn = false;
let saturn;

// ---------- Sound ----------

const saturnSynth = new Tone.Synth().toDestination(); // for SaturnRing
const synth = new Tone.PolySynth(Tone.Synth);
const reverb = new Tone.Reverb({
  decay: 2,
  wet: 0.6,
}).toDestination();

synth.connect(reverb);

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  setTimeout(update, 100); // call update() again in 100 milliseconds
}

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
function use() {
  setTimeout(use, 100); // call use() again in 100 milliseconds
}

// ---------- Controls (Event Handlers) ----------

// ===== Function pointer move, screen =====
function pointerMove(event) {
  const now = performance.now();

  if (previousTime === 0) {
    previousX = event.clientX;
    previousY = event.clientY;
    previousTime = now;
    return;
  }

  const dx = event.clientX - previousX;
  const dy = event.clientY - previousY;

  const distance = Math.sqrt(dx * dx + dy * dy);
  const time = (now - previousTime) / 1000;

  // time cant be 0 or - for the calculations
  if (time <= 0) return;
  // Calculate speed in pixels per second
  mouseSpeed = distance / time;

  previousX = event.clientX;
  previousY = event.clientY;
  previousTime = now;

  speed.push(mouseSpeed);
  if (speed.length > 10) {
    speed.shift(); //takes away the oldest in array
  }
  let total = 0;
  for (let i = 0; i < speed.length; i++) {
    total = total + speed[i];
  }
  let speedAverage = total / speed.length;

  // Map speed to reverb
  const reverbAmount = Math.min(speedAverage / 1000, 0.9);
  reverb.wet.rampTo(reverbAmount, 0.1);
}

// ===== Functions Neptune =====
function playNeptune() {
  console.log("Playing Neptune chord!");

  for (let k = 0; k < neptuneNotes.length; k++) {
    synth.triggerAttack(neptuneNotes[k]);
  }
}

function stopNeptune() {
  for (let k = 0; k < neptuneNotes.length; k++) {
    synth.triggerRelease(neptuneNotes[k]);
  }
}

async function toggleNeptune() {
  await Tone.start();

  if (!keepPlayingNeptune) {
    keepPlayingNeptune = true;
    playNeptune();
  } else {
    keepPlayingNeptune = false;
    stopNeptune();
  }
}

// == Neptune Note 1 ==
function playNeptuneNote1() {
  synth.triggerAttack("C4");
}

function stopNeptuneNote1() {
  synth.triggerRelease("C4");
}

//function pointerdown, Neptune
async function toggleNeptuneNote1() {
  await Tone.start();

  if (!keepPlayingNeptuneNote1) {
    keepPlayingNeptuneNote1 = true;
    playNeptuneNote1();
    console.log("Playing: C4");
  } else {
    keepPlayingNeptuneNote1 = false;
    stopNeptuneNote1();
    console.log("Stop playing: C4");
  }
}
// == Neptune Note 2 ==
function playNeptuneNote2() {
  synth.triggerAttack("E4");
}

function stopNeptuneNote2() {
  synth.triggerRelease("E4");
}

//function pointerdown, Neptune
async function toggleNeptuneNote2() {
  await Tone.start();

  if (!keepPlayingNeptuneNote2) {
    keepPlayingNeptuneNote2 = true;
    playNeptuneNote2();
    console.log("Playing: E4");
  } else {
    keepPlayingNeptuneNote2 = false;
    stopNeptuneNote2();
    console.log("Stop playing: E4");
  }
}
// == Neptune Note 3 ==
function playNeptuneNote3() {
  synth.triggerAttack("G4");
}

function stopNeptuneNote3() {
  synth.triggerRelease("G4");
}

//function pointerdown, Neptune
async function toggleNeptuneNote3() {
  await Tone.start();

  if (!keepPlayingNeptuneNote3) {
    keepPlayingNeptuneNote3 = true;
    playNeptuneNote3();
    console.log("Playing: G4");
  } else {
    keepPlayingNeptuneNote3 = false;
    stopNeptuneNote3();
    console.log("Stop playing: G4");
  }
}

// == Neptune Note 4 ==
function playNeptuneNote4() {
  synth.triggerAttack("B4");
}

function stopNeptuneNote4() {
  synth.triggerRelease("B4");
}

//function pointerdown, Neptune
async function toggleNeptuneNote4() {
  await Tone.start();

  if (!keepPlayingNeptuneNote4) {
    keepPlayingNeptuneNote4 = true;
    playNeptuneNote4();
    console.log("Playing: B4");
  } else {
    keepPlayingNeptuneNote4 = false;
    stopNeptuneNote4();
    console.log("Stop playing: B4");
  }
}

// ===== Functions Mars =====
function playMars() {
  synth.triggerAttackRelease(marsNotes[marsIndex], "8n");
}

async function toggleMars(event) {
  await Tone.start();

  // LEFT CLICK: Start or stop the beat
  if (event.button === 0) {
    if (drumInterval === null) {
      playMars();

      drumInterval = setInterval(() => {
        playMars();
      }, 500);

      console.log("Playing Mars");
    } else {
      clearInterval(drumInterval);
      drumInterval = null;

      console.log("Stop playing Mars");
    }
  }

  // RIGHT CLICK: Change note without stopping the beat
  if (event.button === 2) {
    marsIndex = (marsIndex + 1) % marsNotes.length;

    console.log("Mars note:", marsNotes[marsIndex]);
  }
}

// ===== Functions Saturn =====
// Saturn play note
function playSaturn() {
  // Stop any previously playing note
  if (playingNote !== null) {
    synth.triggerRelease(playingNote);
  }

  // Play current note
  playingNote = saturnNotes[i];
  synth.triggerAttack(playingNote);
  console.log("playing note:", saturnNotes[i]);
}

function stopSaturn() {
  if (!keepPlayingSaturn && playingNote !== null) {
    synth.triggerRelease(playingNote);
    playingNote = null;
  }
}
//pointerdown Saturn
async function toggleNoteSaturn(event) {
  await Tone.start();

  // LEFT CLICK: Start/stop Saturn
  if (event.button === 0) {
    // 0 = left click
    if (!keepPlayingSaturn) {
      keepPlayingSaturn = true;
      playSaturn();
      console.log("Play Saturn");
    } else {
      keepPlayingSaturn = false;
      stopSaturn();
      console.log("Stop Saturn");
    }
  }

  // RIGHT CLICK: Change note
  if (event.button === 2) {
    // 2 = Right click
    i = (i + 1) % saturnNotes.length;

    // If Saturn is playing, immediately play the new note
    if (keepPlayingSaturn) {
      playSaturn();
    }
  }
}

// ===== Functions Saturn ring =====
//Function Detune, SaturnRing

async function playSaturnring() {
  await Tone.start();

  saturnSynth.triggerAttack(saturnNotes[i]);
}

function moveSaturnring(event) {
  const rect = saturn.element.getBoundingClientRect();

  // Mouse position across Saturn, from 0 to 1
  const x = (event.clientX - rect.left) / rect.width;

  // Keep the value between 0 and 1
  const clampedX = Math.max(0, Math.min(1, x));

  // Map the mouse position to -600 through +600 cents
  const detune = clampedX * 1200 - 600;

  // Change the pitch while the note is playing
  saturnSynth.detune.value = detune;
}

function stopPlaySaturnring() {
  saturnSynth.triggerRelease();
}

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  update(); // start the update loop
  use(); // start the use loop

  //Neptune
  const neptune = createShape("neptune", "neptunePlanet");
  //Neptune Note 1 - 4
  const neptuneNote1 = createShape("neptuneNote1", "neptuneNote1");
  const neptuneNote2 = createShape("neptuneNote2", "neptuneNote2");
  const neptuneNote3 = createShape("neptuneNote3", "neptuneNote3");
  const neptuneNote4 = createShape("neptuneNote4", "neptuneNote4");
  //Mars
  const mars = createShape("mars", "marsPlanet");
  //Saturn
  saturn = createShape("saturn", "saturnPlanet");
  //Saturn ring
  const saturnRing = createShape("saturnRing", "saturnRing");

  //--------- Event listeners ----------

  // === Mouse across screen ===
  window.addEventListener("pointermove", pointerMove);

  // === Neptune ===
  neptune.element.addEventListener("pointerdown", toggleNeptune);

  // == Neptune Notes 1-4 ==
  neptuneNote1.element.addEventListener("pointerdown", toggleNeptuneNote1);
  neptuneNote1.element.addEventListener("mouseenter", playNeptuneNote1);
  neptuneNote1.element.addEventListener("mouseleave", stopNeptuneNote1);

  neptuneNote2.element.addEventListener("pointerdown", toggleNeptuneNote2);
  neptuneNote2.element.addEventListener("mouseenter", playNeptuneNote2);
  neptuneNote2.element.addEventListener("mouseleave", stopNeptuneNote2);

  neptuneNote3.element.addEventListener("pointerdown", toggleNeptuneNote3);
  neptuneNote3.element.addEventListener("mouseenter", playNeptuneNote3);
  neptuneNote3.element.addEventListener("mouseleave", stopNeptuneNote3);

  neptuneNote4.element.addEventListener("pointerdown", toggleNeptuneNote4);
  neptuneNote4.element.addEventListener("mouseenter", playNeptuneNote4);
  neptuneNote4.element.addEventListener("mouseleave", stopNeptuneNote4);

  // === Mars ===
  mars.element.addEventListener("pointerdown", toggleMars);
  mars.element.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
  // === Saturn ===
  saturn.element.addEventListener("mouseenter", playSaturn);
  saturn.element.addEventListener("mouseleave", stopSaturn);
  saturn.element.addEventListener("pointerdown", toggleNoteSaturn);

  saturn.element.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  // == SaturnRing ==
  saturnRing.element.addEventListener("mouseenter", playSaturnring);
  saturnRing.element.addEventListener("mousemove", moveSaturnring);
  saturnRing.element.addEventListener("mouseleave", stopPlaySaturnring);
}
setup(); // Always remember to call setup()!
