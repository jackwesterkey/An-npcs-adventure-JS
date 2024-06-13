import { colorizeBackground, drawBoundaries, drawTiles, fetchMapData, playerAnimIfNotPlaying } from "../utils.js";
import { generatePlayerComponents, setPlayerMovement } from "../entities/player.js";
import { generateoldmanComponents, StartInterAction } from "../entities/oldman.js";

export default async function house(k) {
    // Colorize the background
    colorizeBackground(k, 27, 29, 52);

    // Fetch map data
    const mapData = await fetchMapData("./assets/maps/house.json");
    const map = k.add([k.pos(605, 200)]);

    // Define entities object to store oldman and player
    const entities = {
        oldman: null,
        player: null
    };

    // Iterate through layers of map data
    const layers = mapData.layers;
    for (const layer of layers) {
        // Check if the layer represents "Boundaries"
        if (layer.name === "Boundaries") {
            // If it does, draw boundaries for the map
            drawBoundaries(k, map, layer);
            continue;
        }

        // Check if the layer represents "SpawnPoints"
        if (layer.name === "SpawnPoints") {
            // Iterate through objects in the layer
            for (const object of layer.objects) {
                // Check if the object is a player
                if (object.name === "player") {
                    // Add player components to the map and store in entities
                    entities.player = map.add(
                        generatePlayerComponents(k, k.vec2(object.x, object.y))
                    );
                    continue;
                }
                // Check if the object is the old man
                if (object.name === "oldman") {
                    entities.oldman = map.add(
                        generateoldmanComponents(k, k.vec2(object.x, object.y))
                    );
                }
            }
            // Set player movement
            setPlayerMovement(k, entities.player);

            // Handle player collision with the exit door
            entities.player.onCollide("door-exit", () => {
                k.go("world");
            });

            // Handle player collision with the old man
            entities.player.onCollide("oldman", () => {
                StartInterAction(k, entities.oldman, entities.player);
            });
            entities.player.onCollideEnd("oldman", () => {
             playerAnimIfNotPlaying(entities.oldman, "oldman-down");
            });
            continue;
        }

        // If the layer is neither "Boundaries" nor "SpawnPoints", draw tiles
        drawTiles(k, map, layer, mapData.tileheight, mapData.tilewidth);
    }
    k.camScale(4.3);
}
