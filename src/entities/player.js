import { gameState, playerState } from "../state/stateManagers.js";
import { areAnyOfTheseKeysDown, playerAnimIfNotPlaying } from "../utils.js";

export function generatePlayerComponents(k, pos) {
    return [
        k.sprite("assets", {
            anim: "player-idle-down",
        }),
        k.area({ shape: new k.Rect(k.vec2(3, 4), 10, 12) }),
        k.body(),
        k.pos(pos),
        k.opacity(),
        {
            keyboardSpeed: 100,
            gamepadSpeed: 132,
            attackPower: 1,
            direction: "down",
            isAttacking: false,
            isFrozen: false,
        },
        "player",
    ];
}

export function setPlayerMovement(k, player) {
    function handleMovement(x, y, flipX, direction, anim) {
        player.flipX = flipX;
        player.move(x, y);
        player.direction = direction;
        playerAnimIfNotPlaying(player, anim);
    }

    let lastInput = null;

    k.onKeyDown((key) => {
        if (gameState.getFreezePlayer()) return;
        if (k.isKeyDown("space")) return;
        lastInput = "keyboard";

        if ((key === "left" && !areAnyOfTheseKeysDown(k, ["a", "up", "down", "w", "s"])) ||
            (key === "a" && !areAnyOfTheseKeysDown(k, ["left", "up", "down", "w", "s"]))) {
            handleMovement(-player.keyboardSpeed, 0, true, "left", "player-side");
        } else if ((key === "right" && !areAnyOfTheseKeysDown(k, ["d", "up", "down", "w", "s"])) ||
            (key === "d" && !areAnyOfTheseKeysDown(k, ["right", "up", "down", "w", "s"]))) {
            handleMovement(player.keyboardSpeed, 0, false, "right", "player-side");
        } else if ((key === "up" && !areAnyOfTheseKeysDown(k, ["w", "left", "right", "a", "d"])) ||
            (key === "w" && !areAnyOfTheseKeysDown(k, ["up", "left", "right", "a", "d"]))) {
            handleMovement(0, -player.keyboardSpeed, false, "up", "player-up");
        } else if ((key === "down" && !areAnyOfTheseKeysDown(k, ["s", "left", "right", "a", "d"])) ||
            (key === "s" && !areAnyOfTheseKeysDown(k, ["down", "left", "right", "a", "d"]))) {
            handleMovement(0, player.keyboardSpeed, false, "down", "player-down");
        }
    });

    k.onKeyPress((key) => {
        if (key !== "space") return;
        if (gameState.getFreezePlayer()) return;
        if (!playerState.getIsSwordEquipped()) return;
        
        player.isAttacking = true;

        

        if (k.get("swordHitBox").length === 0) {
            const swordHitBoxPosX = {
                left: player.worldPos().x - 2,
                right: player.worldPos().x + 10,
                up: player.worldPos().x + 5,
                down: player.worldPos().x + 2,
            };
            const swordHitBoxPosY = {
                left: player.worldPos().y + 5,
                right: player.worldPos().y + 5,
                up: player.worldPos().y,
                down: player.worldPos().y + 10,
            };

            k.add([
                k.area({ shape: new k.Rect(k.vec2(0), 8, 8) }),
                k.pos(
                    swordHitBoxPosX[player.direction],
                    swordHitBoxPosY[player.direction]
                ),
                "swordHitBox",
            ]);
            k.wait(0.1, () => {
                k.destroyAll("swordHitBox");
                if (player.direction === "left" || player.direction === "right") {
                    playerAnimIfNotPlaying(player, "player-side");
                    player.stop();
                    return;
                }
                playerAnimIfNotPlaying(player, `player-${player.direction}`);
                player.stop();
            });
        }
        playerAnimIfNotPlaying(player, `player-attack-${player.direction}`);
    });

    k.onKeyPress((key) => {
        if (key !== "2") return;
     if (!playerState.getIsSWORD()) return;
        // Define the spinning function
        player.isAttacking = true;
        function spin() {
            let spinning = false;
            let angle = 0;
    
            return {
                id: "spin",
                update() {
                    if (spinning) {
                        angle += 1200 * k.dt(); // Update angle based on delta time for smooth animation
                        this.angle = angle; // Apply rotation to the sword entity
                        if (angle >= 360) {
                            angle = 0;
                            spinning = false;
                            this.destroy(); // Destroy the sword entity itself
                        }
                    }
                },
                spin() {
                    spinning = true;
                },
            };
        }
    
        // Add the sword entity with spinning animation
        const sword = player.add([
            k.pos(8, 9),
            k.area({ shape: new k.Rect(k.vec2(0), 23, 8) }),
            k.sprite("assets", {
                anim: "sword",
            }),
            k.anchor("bot"),
            k.rotate(0),
            "sword",
            spin(), // Add the spin component directly
        ]).spin(); // Start spinning the sword immediately after adding it
    });

    k.onKeyPress((key) => {
        if (key !== "-") return;
    
        if (!playerState.getIsMagicBullet()) return;
    
        player.isAttacking = true;
    
        // Constants for bullet behavior
        const MagicBullet_SPEED = 40;
        const anotherVerticalOffset = -10; // for up
        const horizontalOffset = 7; // for right
        const verticalOffset = 12; // for right
        const ANOTHERverticalOffset = 12; // for left
        const ANOTHERhorizontalOffset = 10; // for left
    
        // Function to spawn a magic bullet
        function spawnMagicBullet(pos, direction) {
            let velocity;
            let offset = k.vec2(0, 0);
            let rotation = 0;
    
            switch (direction) {
                case "left":
                    velocity = k.vec2(-MagicBullet_SPEED, 0);
                    offset = k.vec2(-player.width / 2, 0).add(k.vec2(ANOTHERhorizontalOffset, ANOTHERverticalOffset));
                    rotation = 90;
                    break;
                case "right":
                    velocity = k.vec2(MagicBullet_SPEED, 0);
                    offset = k.vec2(player.width / 2, 0).add(k.vec2(horizontalOffset, verticalOffset));
                    rotation = -90;
                    break;
                case "down":
                    velocity = k.vec2(0, MagicBullet_SPEED);
                    offset = k.vec2(0, player.height / 2).add(k.vec2(ANOTHERhorizontalOffset, ANOTHERverticalOffset));
                    rotation = 180;
                    break;
                case "up":
                    velocity = k.vec2(0, -MagicBullet_SPEED);
                    offset = k.vec2(0, -player.height / 2).add(k.vec2(horizontalOffset, -anotherVerticalOffset));
                    rotation = 0;
                    break;
            }
    
            const MagicBullet = k.add([
                k.rect(3, 3),
                k.pos(pos.add(offset)),
                k.area(),
                k.move(velocity),
                k.color(255, 255, 255),
                k.outline(0.8),
                k.rotate(rotation),
                k.offscreen({ destroy: true }),
                "MagicBullet"
            ]);
    
            MagicBullet.vel = velocity; // Set velocity property for bullet
        }
    
        k.onKeyPress("1", () => {
            spawnMagicBullet(player.pos, player.direction);
        });
    
        k.onUpdate("MagicBullet", (MagicBullet) => {
            MagicBullet.move(MagicBullet.vel);
            MagicBullet.onCollide((obj) => {
                MagicBullet.destroy();
            });
        });
    
    });
    

    k.onKeyRelease(() => {
        if (lastInput === "keyboard") {
            player.isAttacking = false;
            player.stop();
        }
    });

    function handleGamepadInput(player, gamepad) {
        if (gameState.getFreezePlayer()) return;

        const speed = player.gamepadSpeed;
        const dpadPressed = gamepad.buttons[12].pressed || gamepad.buttons[13].pressed || gamepad.buttons[14].pressed || gamepad.buttons[15].pressed;
        if (dpadPressed) {
            lastInput = "gamepad";
            if (gamepad.buttons[12].pressed) {
                handleMovement(0, -speed, false, "up", "player-up");
            } else if (gamepad.buttons[13].pressed) {
                handleMovement(0, speed, false, "down", "player-down");
            } else if (gamepad.buttons[15].pressed) {
                handleMovement(speed, 0, false, "right", "player-side");
            } else if (gamepad.buttons[14].pressed) {
                handleMovement(-speed, 0, true, "left", "player-side");
            }
        } else if (lastInput === "gamepad") {
            player.stop();
        }
    }

    function checkGamepadInput() {
        const gamepads = navigator.getGamepads();
        for (const gamepad of gamepads) {
            if (gamepad) {
                handleGamepadInput(player, gamepad);
            }
        }
    }

    setInterval(checkGamepadInput, 20); // Poll every 20 milliseconds
}
