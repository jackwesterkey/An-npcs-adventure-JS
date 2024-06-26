import { playerState } from "../state/stateManagers.js";

const widthScale = 1.8;
const heightScale = 1.8;

export function healthBar(k) {
  let nbFullHearts = Math.floor(playerState.getHealth());
  let addHalfHeart = false;

  if (playerState.getHealth() - nbFullHearts === 0.5) {
    addHalfHeart = true;
  }

  let nbEmptyHearts =
    playerState.getMaxHealth() - nbFullHearts - (addHalfHeart ? 1 : 0);

  const heartsContainer = k.add([k.pos(20, 32), k.fixed(), "healthContainer"]);

  let previousX = 0;
  for (let i = 0; i < nbFullHearts; i++) {
    heartsContainer.add([k.sprite("full-heart"), k.pos(previousX, 0), k.scale(widthScale, heightScale)]);
    previousX += 48 * widthScale;
  }

  if (addHalfHeart) {
    heartsContainer.add([k.sprite("half-heart"), k.pos(previousX, 0), k.scale(widthScale, heightScale)]);
    previousX += 48 * widthScale;
  }

  if (nbEmptyHearts > 0) {
    for (let i = 0; i < nbEmptyHearts; i++) {
      heartsContainer.add([k.sprite("empty-heart"), k.pos(previousX, 0), k.scale(widthScale, heightScale)]);
      previousX += 48 * widthScale;
    }
  }

  return heartsContainer;
}
