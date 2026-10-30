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
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which notes you can play, how fast things move, the tempo.¨
let drumInterval = null;
let i = 0;
let playingNote = null;
let keepPlayingNeptune = false;
let keepPlayingSaturn = false;
let saturn;

//Note array
const notes = ["C2", "D2", "E2", "F2", "G2", "A2", "B2"];

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // can play several notes at once
const saturnSynth = new Tone.Synth().toDestination(); // for SaturnRing

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

//Function Mars
function playMars() {
  console.log("Cursor entered Mars");
  synth.triggerAttackRelease("C3", "8n");
}
//function pointerdown, Mars
async function toggleMars() {
  await Tone.start();

  if (drumInterval === null) {
    // Start the beat
    playMars();

    drumInterval = setInterval(() => {
      playMars();
    }, 500);
  } else {
    // Stop the beat
    clearInterval(drumInterval);
    drumInterval = null;
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
  } else {
    keepPlayingNeptune = false;
    stopNeptune();
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
  } else {
    keepPlayingSaturn = false;
    stopSaturn();
  }
}
//Function Detune, SaturnRing

async function playSaturnring() {
  await Tone.start();

  saturnSynth.triggerAttack(notes[i]);
  console.log("Cursor entered Saturn");
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

  console.log("X:", clampedX, "Detune:", detune);
}

function stopPlaySaturnring() {
  saturnSynth.triggerRelease();
}

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  update(); // start the update loop
  use(); // start the use loop

  //Drum2
  const neptune = createShape("neptune", "neptunePlanet");
  //drum1
  const mars = createShape("mars", "marsPlanet");
  //Saturn
  saturn = createShape("saturn", "saturnPlanet");
  //Saturn ring
  const saturnRing = createShape("saturnRing", "saturnRing");

  //--------- Event listeners --------------------------------------------------

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
