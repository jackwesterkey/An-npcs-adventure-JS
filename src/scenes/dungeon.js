import {
  colorizeBackground,
  drawTiles,
  fetchMapData,
  drawBoundaries,
  onAttacked,
  onCollideWithPlayer,
} from "../utils.js";

import {
  generatePlayerComponents,
  setPlayerMovement,
} from "../entities/player.js";
import { gameState, playerState } from "../state/stateManagers.js";
import { healthBar } from "../uiComponents/healthbar.js";
import { dialog } from "../uiComponents/dialog.js";
import sonLines from "../content/sonDialogue.js";
import {
  generateGhostComponents,
  onGhostDestroyed,
  setGhostAI,
} from "../entities/ghost.js";


export default async function dungeon(k) {
  colorizeBackground(k, 27, 29, 52);
  const mapData = await fetchMapData("./assets/maps/dungeon.json");
  const map = k.add([k.pos(520, 85)]);

  const entities = {
    player: null,
    ghost: null,
  };

  const layers = mapData.layers;
  for (const layer of layers) {
    if (layer.name === "Boundaries") {
      drawBoundaries(k, map, layer);
      continue;
    }

    if (layer.name === "SpawnPoints") {
      for (const object of layer.objects) {
        if (object.name === "player") {
          entities.player = map.add(
            generatePlayerComponents(k, k.vec2(object.x, object.y))
          );
          continue;
        }

        // Commenting out ghost-related code
        if (object.name === "ghost" && !gameState.getIsGhostDefeated()) {
          entities.ghost = map.add(
            generateGhostComponents(k, k.vec2(object.x, object.y))
          );
          continue;
        }

        if (object.name === "prison-door") {
          map.add([
            k.sprite("assets", { frame: playerState.getHasKey() ? 506 : 505 }),
            !playerState.getHasKey() && k.area(),
            !playerState.getHasKey() && k.body({ isStatic: true }),
            k.pos(object.x, object.y),
            "prison-door",
          ]);
          continue;
        }

        if (object.name === "boulder") {
          const boulder = map.add([
            k.sprite("assets", { frame: 392 }),
            k.area(),
            k.body({ isStatic: false }),
            k.pos(object.x, object.y),
            "boulder",
          ]);
          
          // Add collision handler for boulder with door-exit 
          // to do later add door-entrance  to this line
          boulder.onCollide("door-exit", () => {
            boulder.destroy();
          });
        }
      }
      continue;
    }

    drawTiles(k, map, layer, mapData.tileheight, mapData.tilewidth);
  }

  setPlayerMovement(k, entities.player);

  entities.player.onCollide("door-exit", () => {
    gameState.setPreviousScene("dungeon");
    k.go("world");
  });

  async function slideCamY(k, range, duration) {
    const currentCamPos = k.camPos();
    await k.tween(
      currentCamPos.y,
      currentCamPos.y + range,
      duration,
      (newPosY) => k.camPos(currentCamPos.x, newPosY),
      k.easings.linear
    );
  }

  entities.player.onCollide("door-entrance", async () => {
    gameState.setFreezePlayer(true);
    await slideCamY(k, -180, 1);
    entities.player.pos.y -= 50;
    gameState.setFreezePlayer(false);
  });

  entities.player.onCollide("door-exit-2", async () => {
    gameState.setFreezePlayer(true);
    await slideCamY(k, 180, 1);
    entities.player.pos.y += 50;
    gameState.setFreezePlayer(false);
  });

  entities.player.onCollide("prison-door", async (prisonDoor) => {
    const dialogIndex = playerState.getHasKey() ? 1 : 0;
    const sonDialog = sonLines.english[dialogIndex];

    await dialog(
      k,
      k.vec2(250, 500),
      sonDialog
    );

    if (playerState.getHasKey()) {
      prisonDoor.frame = 506;
      prisonDoor.unuse("body");
      prisonDoor.unuse("area");
    }

    gameState.setIsSonSaved(true);
  });

  entities.player.onCollide("son", async () => {
    await dialog(k, k.vec2(250, 500), sonLines.english[2]);
  });

  if (entities.ghost !== null) {
    setGhostAI(k, entities.ghost, entities.player);
    onAttacked(k, entities.ghost, entities.player);
    onCollideWithPlayer(k, entities.ghost);
    onGhostDestroyed(k);
  }

  k.camScale(4);
  healthBar(k);
}



  //entities.player.onCollide("door-entrance", () => k.go("rabbit"));