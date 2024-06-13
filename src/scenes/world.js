import { generatePlayerComponents, setPlayerMovement } from "../entities/player.js";
import { generateSlimeComponents, setSlimeAI } from "../entities/slime.js";
import { colorizeBackground, drawBoundaries, drawTiles, fetchMapData } from "../utils.js";

export default async function world(k) {
    colorizeBackground(k, 76, 170, 255);

    let entities = {
        player: null,
        slimes: [],
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
                    if (object.name === "player") {
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
        k.camScale(4.4);
        k.camPos(entities.player.worldPos());
        k.onUpdate(async () => {
            if (entities.player.pos.dist(k.camPos())) {
                await k.tween(
                    k.camPos(),
                    entities.player.worldPos(),
                    0.15,
                    (newPos) => {
                        k.camPos(newPos);
                    },
                    k.easings.linger,
                );
            }
        });

        setPlayerMovement(k, entities.player);

        for (const slime of entities.slimes) {
            setSlimeAI(k, slime);
        }
    }
    entities.player.onCollide("door-entrance", () =>{
    k.go("house");
    });
}
