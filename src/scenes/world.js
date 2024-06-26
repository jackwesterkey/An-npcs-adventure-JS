// world.js

import { healthBar } from "../uiComponents/healthbar.js";
import {
  generatePlayerComponents,
  setPlayerMovement,
} from "../entities/player.js";
import { generateSlimeComponents, setSlimeAI } from "../entities/slime.js";
import { gameState } from "../state/stateManagers.js";
import {
  colorizeBackground,
  drawTiles,
  fetchMapData,
  drawBoundaries,
  onAttacked,
  onCollideWithPlayer,
} from "../utils.js";
import { generatewizComponents, StartInterAction } from "../entities/wiz.js";
import { generatewiz2Components, StartInterAction2 } from "../entities/wiz2.js";
import { playerAnimIfNotPlaying } from "../utils.js";

export default async function world(k) {
  const previousScene = gameState.getPreviousScene();
  colorizeBackground(k, 0, 122, 212);

  let entities = {
    player: null,
    slimes: [],
    wiz: null,
    wiz2: null
  };

  try {
    const mapData = await fetchMapData("./assets/maps/world.json");
    const map = k.add([k.pos(0, 0)]);

    const layers = mapData.layers;
    for (const layer of layers) {
      if (layer.name === "Boundaries") {
        drawBoundaries(k, map, layer);
        continue;
      }

      if (layer.name === "SpawnPoints") {
        for (const object of layer.objects) {
          if (object.name === "player-dungeon" && previousScene === "dungeon") {
            entities.player = map.add(
              generatePlayerComponents(k, k.vec2(object.x, object.y))
            );
            continue;
          }

          if (object.name === "player" && (!previousScene || previousScene === "house")) {
            entities.player = map.add(
              generatePlayerComponents(k, k.vec2(object.x, object.y))
            );
            continue;
          }

          if (object.name === "slime") {
            const slime = map.add(generateSlimeComponents(k, k.vec2(object.x, object.y)));
            entities.slimes.push(slime);
            continue;
          }

          if (object.name === "wiz") {
            entities.wiz = map.add(generatewizComponents(k, k.vec2(object.x, object.y)));
            continue;
          }

          if (object.name === "wiz2") {
            entities.wiz2 = map.add(generatewiz2Components(k, k.vec2(object.x, object.y)));
            continue;
          }
        }
        continue;
      }

      drawTiles(k, map, layer, mapData.tileheight, mapData.tilewidth);
    }
  } catch (error) {
    console.error("Error loading world map:", error);
    // Handle error appropriately
  }

  if (entities.player) {
    k.camScale(5);
    k.camPos(entities.player.worldPos());
    k.onUpdate(async () => {
      if (entities.player.pos.dist(k.camPos()) > 3) {
        await k.tween(
          k.camPos(),
          entities.player.worldPos(),
          0.15,
          (newPos) => k.camPos(newPos),
          k.easings.linear
        );
      }
    });

    setPlayerMovement(k, entities.player);

    for (const slime of entities.slimes) {
      setSlimeAI(k, slime);
      onAttacked(k, slime, entities.player);
      onCollideWithPlayer(k, slime);
    }

    healthBar(k);

    // Handle player collision with wiz
    entities.player.onCollide("wiz", async () => {
      await StartInterAction(k, entities.wiz, entities.player);
    });

    entities.player.onCollideEnd("wiz", () => {
      playerAnimIfNotPlaying(entities.wiz, "wiz1");
    });

    // Handle player collision with wiz2
    entities.player.onCollide("wiz2", async () => {
      await StartInterAction2(k, entities.wiz2, entities.player);
      gameState.setIsWizardTouched(true);
    });

    entities.player.onCollideEnd("wiz2", () => {
      playerAnimIfNotPlaying(entities.wiz2, "Ewiz1");
    });

    entities.player.onCollide("door-entrance", () => k.go("house"));
    entities.player.onCollide("dungeon-door-entrance", () => k.go("dungeon"));

    entities.player.onCollide("endgame", () => {
      if (gameState.getIsSonSaved()) {
        k.go("credits");
      }
    });
  }
}
