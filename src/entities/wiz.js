import wizcon from "../content/wizcon.js";
import { WizState, playerState } from "../state/stateManagers.js";
import { dialog } from "../uiComponents/dialog.js";
import { playerAnimIfNotPlaying } from "../utils.js";


export function generatewizComponents(k, pos) {
  return [
    k.sprite("assets", {
      anim: "wiz1",
    }),
    k.area({ shape: new k.Rect(k.vec2(2, 4), 12, 12) }),
    k.body({ isStatic: true }),
    k.pos(pos),
    {},
    "wiz",
  ];
}

export async function StartInterAction(k, wiz, player) {
    if (player.direction === "right") {
      wiz.flipx = true;
      playerAnimIfNotPlaying(wiz, "wiz3"); //left
    } else if (player.direction === "left") {
      wiz.flipx = false;
      playerAnimIfNotPlaying(wiz, "wiz4"); //right
    } else if (player.direction === "down") {
        playerAnimIfNotPlaying(wiz, "wiz2");
    }
  
    playerState.setIsMagicBullet(true);
  
    const response = wizcon.english;
  
    if (WizState.getNbTalkedWiz() === 0) {
      await dialog(k, k.vec2(250, 500), response[0]); // Assuming response[0] is the first dialogue
      WizState.setNbTalkedWiz(1); // Set NbTalkedWiz to indicate that the player has talked to Wiz
    }
  }
  