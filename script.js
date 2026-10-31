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

const notes = ["C2", "D2", "E2", "F2", "G2", "A2", "B2"];

// ---------- State ----------

let drumInterval = null;
let i = 0;
let playingNote = null;
let keepPlayingNeptune = false;
let keepPlayingSaturn = false;
let saturn;

// Mouse movement
let previousX = 0;
let previousY = 0;
let mouseSpeed = 0;
let speeds = [];

// ---------- Sound ----------

const saturnSynth = new Tone.Synth().toDestination(); // for SaturnRing
const synth = new Tone.PolySynth(Tone.Synth);
const reverb = new Tone.Reverb({
  decay: 2,
  wet: 0,
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

let previousTime = 0;

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

  // Calculate speed in pixels per second
  mouseSpeed = distance / time;

  previousX = event.clientX;
  previousY = event.clientY;
  previousTime = now;

  // Map speed to reverb
  const reverbAmount = Math.min(mouseSpeed / 1000, 0.9);

  reverb.wet.rampTo(reverbAmount, 0.1);

}

//Function Mars
function playMars() {
  synth.triggerAttackRelease("C2", "8n");
}
//function pointerdown, Mars
async function toggleMars() {
  await Tone.start();

  if (drumInterval === null) {
    // Start the beat
    playMars();
    console.log("Play Mars");

    drumInterval = setInterval(() => {
      playMars();
    }, 500);
  } else {
    // Stop the beat
    clearInterval(drumInterval);
    drumInterval = null;
    console.log("Stop playing Mars");
  }
}

//Function hover, Neptune
function playNeptune() {
  console.log("Cursor entered Neptune!");
  synth.triggerAttack("D2");
}

function stopNeptune() {
  synth.triggerRelease("D2");
}

//function pointerdown, Neptune
async function toggleNeptune() {
  await Tone.start();

  if (!keepPlayingNeptune) {
    keepPlayingNeptune = true;
    playNeptune();
    console.log("Playing Neptune");
  } else {
    keepPlayingNeptune = false;
    stopNeptune();
    console.log("Stop playing Neptune");
  }
}

// Saturn play note
function playSaturn() {
  // Stop any previously playing note
  if (playingNote !== null) {
    synth.triggerRelease(playingNote);
  }

  // Play current note
  playingNote = notes[i];
  synth.triggerAttack(playingNote);
  console.log("playing note:", notes[i])
}

function stopSaturn() {
  if (!keepPlayingSaturn && playingNote !== null) {
    synth.triggerRelease(playingNote);
    playingNote = null;
  }
}
//pointerdown Saturn
async function toggleNoteSaturn() {
  await Tone.start();

  if (!keepPlayingSaturn) {
    keepPlayingSaturn = true;
    playSaturn();
     console.log("Play Saturn")
  } else {
    keepPlayingSaturn = false;
    stopSaturn();
    console.log("Stop playing Saturn");
  }
}

//Function Detune, SaturnRing

async function playSaturnring() {
  await Tone.start();

  saturnSynth.triggerAttack(notes[i]);
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
  //Mars
  const mars = createShape("mars", "marsPlanet");
  //Saturn
  saturn = createShape("saturn", "saturnPlanet");
  //Saturn ring
  const saturnRing = createShape("saturnRing", "saturnRing");

  //--------- Event listeners ----------

  window.addEventListener("pointermove", pointerMove);
  mars.element.addEventListener("pointerdown", toggleMars);

  neptune.element.addEventListener("mouseenter", playNeptune);
  neptune.element.addEventListener("mouseleave", stopNeptune);
  neptune.element.addEventListener("pointerdown", toggleNeptune);

  saturnRing.element.addEventListener("mouseenter", playSaturnring);
  saturnRing.element.addEventListener("mousemove", moveSaturnring);
  saturnRing.element.addEventListener("mouseleave", stopPlaySaturnring);

  saturn.element.addEventListener("mouseenter", playSaturn);
  saturn.element.addEventListener("mouseleave", stopSaturn);
  saturn.element.addEventListener("pointerdown", toggleNoteSaturn);

  // Shift changes the note
  document.addEventListener("keydown", (event) => {
    if (event.key === "Shift" && !event.repeat) {
      i = (i + 1) % notes.length;

      // Change sound only if currently playing
      if (playingNote !== null) {
        playSaturn();
      }
    }
  });
}
setup(); // Always remember to call setup()!
