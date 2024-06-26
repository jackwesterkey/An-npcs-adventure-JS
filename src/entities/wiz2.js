// wiz2.js

import wizcon2 from "../content/wizcon2.js";
import { WizState2,playerState, gameState } from "../state/stateManagers.js";
import { dialog } from "../uiComponents/dialog.js";
import { playerAnimIfNotPlaying } from "../utils.js";

export function generatewiz2Components(k, pos) {
  return [
    k.sprite("assets", {
      anim: "Ewiz1",
    }),
    k.area({ shape: new k.Rect(k.vec2(2, 4), 12, 12) }),
    k.body({ isStatic: true }),
    k.pos(pos),
    {},
    "wiz2", // Ensure the tag matches the collision handler in world.js
  ];
}

export async function StartInterAction2(k, wiz2, player) {
  // Flip sprite and set animation based on player direction
  if (player.direction === "right") {
    wiz2.flipX = false;
    playerAnimIfNotPlaying(wiz2, "Ewiz3"); // left animation
  } else if (player.direction === "left") {
    wiz2.flipX = false;
    playerAnimIfNotPlaying(wiz2, "Ewiz4"); // right animation
  } else if (player.direction === "down") {
    playerAnimIfNotPlaying(wiz2, "Ewiz2"); // down animation
  }

  playerState.setIsSWORD(true);

  const response = wizcon2.english;

  // Start dialog if it's the first interaction
  if (WizState2.getNbTalkedWiz() === 0) {
    await dialog(k, k.vec2(250, 500), response[0]); // Assuming response[0] is the first dialogue
    WizState2.setNbTalkedWiz(1); // Mark the Wiz as talked
  }
}
