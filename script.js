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
// For example: which notes you can play, how fast things move, the tempo.
const note = "C4"; // the note played when the pointer goes down

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // can play several notes at once

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
// Runs every time the pointer goes down: a click, a tap or a pen touch.
function pointerDown(event) {
  Tone.start(); // browsers only allow sound after the player has pressed something

  console.log("Pointer down at", event.clientX, event.clientY);
  synth.triggerAttackRelease(note, "8n"); // play the note for an eighth note
}

//Function hover, Drum 1
function playDrumSound() {
  console.log("Cursor entered drum1!");
  synth.triggerAttack("C3");
}

function stopDrumSound() {
  synth.triggerRelease("C3");
}

//Function hover, Drum 2
function playDrumSound2() {
  console.log("Cursor entered drum2!");
  synth.triggerAttack("D2");
}

function stopDrumSound2() {
  synth.triggerRelease("D2");
}

//Function swipe

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  update(); // start the update loop
  use(); // start the use loop

  // Example: a shape near the middle of the window. Replace it with your own.

  //Drum2
  const drum2 = createShape("neptune", "neptunePlanet");
  drum2.setPosition(0.025, 0.5);

  //drum1
  const drum1 = createShape("uranus", "uranusPlanet");
  drum1.setPosition(0.2, 0.75);

  const saturn = createShape("saturn", "saturnPlanet");
  saturn.setPosition(0.275, 0.175);

  //Swipe
  /*const swipe = createShape("swipe", "saturnRing");
  swipe.setPosition(0.05, 0.2);
  swipe.setRotation(10);
  */


  const jupiter = createShape("jupiter", "jupiterPlanet");
  jupiter.setPosition(0.575, 0.625);

  const mars = createShape("mars", "marsPlanet");
  mars.setPosition(0.650, 0.275);

  const earth = createShape("earth", "earthPlanet");
  earth.setPosition(0.7, 0.0725);

  const venus = createShape("venus", "venusPlanet");
  venus.setPosition(0.9, 0.275);

  const mercurie = createShape("mercurie", "mercuriePlanet");
  mercurie.setPosition(0.95, 0.125);

  // Put your event listener code here
  window.addEventListener("pointerdown", pointerDown);
  drum1.element.addEventListener("mouseenter", playDrumSound);
  drum1.element.addEventListener("mouseleave", stopDrumSound);

  drum2.element.addEventListener("mouseenter", playDrumSound2);
  drum2.element.addEventListener("mouseleave", stopDrumSound2);
}

setup(); // Always remember to call setup()!
