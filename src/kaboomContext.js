import kaboom from "../lib/kaboom.mjs";

const k = kaboom({
  width: 1480,
  height: 680,
  //letterbox: false,
  global: false,
// debug: false, // Disable Kaboom debug overlay
});

export default k;

document.addEventListener("keydown", (event) => {
  if (event.key === "F1") {
    event.preventDefault();
    return false; // Returning false prevents default action
  }
});

//// dis was not needed 