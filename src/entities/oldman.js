import oldmanLines from "../content/oldmanDialogue.js";
import { oldManState, playerState } from "../state/stateManagers.js";
import { dialog } from "../uiComponents/dialog.js";
import { playerAnimIfNotPlaying } from "../utils.js";

export function generateoldmanComponents(k, pos) {
  return [
    k.sprite("assets", {
      anim: "oldman-down",
    }),
    k.area({ shape: new k.Rect(k.vec2(2, 4), 12, 12) }),
    k.body({ isStatic: true }),
    k.pos(pos),
    {},
    "oldman",
  ];
}

export async function StartInterAction(k, oldman, player) {
  if (player.direction === "right") {
    oldman.flipx = true;
    playerAnimIfNotPlaying(oldman, "oldman-side");
  }

  if (player.direction === "left") {
    oldman.flipx = false;
    playerAnimIfNotPlaying(oldman, "oldman-side2");
  }

  if (player.direction === "down") {
    playerAnimIfNotPlaying(oldman, "oldman-up");
  }

  playerState.setIsSwordEquipped(true);

  const response = oldmanLines.english;

  let nbtalkedOldMan = oldManState.getNbTalkedOldMan();
  if (nbtalkedOldMan > response.length - 2) {
    oldManState.setNbTalkedOldMan(1);
    nbtalkedOldMan = oldManState.getNbTalkedOldMan();
  }

  if (response[nbtalkedOldMan]) {
    await dialog(k, k.vec2(250, 500), response[nbtalkedOldMan]);
    oldManState.setNbTalkedOldMan(nbtalkedOldMan + 1);
  }
}
