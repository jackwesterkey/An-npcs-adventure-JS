import k from "./kaboomContext.js";
import world from "./scenes/world.js";
import house from "./scenes/house.js";
//import { SaveSystem } from "./save.js";

k.loadFont("OldLondon", "./assets/OldLondon.ttf")
k.loadSprite("assets", "./assets/topdownasset.png", {
    sliceX: 39,
    sliceY: 31,
    anims: {
        "player-idle-down": 936,
        "player-down": {
            from: 936,
            to: 939,
            loop: true,
        },
        "player-idle-side": 976,
        "player-side": {
            from: 976,
            to: 978,
            loop: true,
        },
        "player-idle-up": 1014,
        "player-up": {
            from: 1014,
            to: 1017,
            loop: true,
        },
        "slime-idle-down": 858,
        "slime-down": {
            from: 858,
            to: 859,
            loop: true,
        },
        "slime-idle-side": 860,
        "slime-side": {
            from: 860,
            to: 861,
            loop: true,
        },
        "slime-idle-up": 897,
        "slime-up": {
            from: 897,
            to: 898,
            loop: true,
        },
        "oldman-down": 866,
        "oldman-side": 907,
        "oldman-up": 905,
        "oldman-side2": 868,
    },
});

const scenes = {
    world,
    house,
};

for (const sceneName in scenes) {
    k.scene(sceneName, () => scenes[sceneName](k));
}
 //await SaveSystem.load ();
 //if (!SaveSystem.data) {
// SaveSystem.data
 //await SaveSystem.save();
 //await SaveSystem.load();
 //};
k.go("world");
