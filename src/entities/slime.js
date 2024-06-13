import { playerAnimIfNotPlaying } from "../utils.js";

const directionalStates = ["left", "right", "up", "down"];

export function generateSlimeComponents(k, pos) {
  return [
    k.sprite("assets", { frame: 858 }),
    k.area({
      shape: new k.Rect(k.vec2(0, 4), 16, 10),
      collisionIgnore: ["slime"],
    }),
    k.body(),
    k.pos(pos),
    k.offscreen(),
    k.state("idle", ["idle", ...directionalStates]),
    k.health(1),
    k.opacity(),
    {
      speed: 30,
      attackPower: 0.5,
    },
    "slime",
  ];
}

async function move(k, entity, isHorizontal, moveBy, duration) {
  await entity.tween(
    isHorizontal ? entity.pos.x : entity.pos.y,
    isHorizontal ? entity.pos.x + moveBy : entity.pos.y + moveBy,
    duration,
    (val) => {
      isHorizontal ? (entity.pos.x = val) : (entity.pos.y = val);
    },
    k.easings.linear
  );
}

export function setSlimeAI(k, slime) {
  k.onUpdate(() => {
    switch (slime.state) {
      case "right":
        slime.move(slime.speed, 0);
        break;
      case "left":
        slime.move(-slime.speed, 0);
        break;
      case "up":
        slime.move(0, -slime.speed);
        break;
      case "down":
        slime.move(0, slime.speed);
        break;
      default:
    }
  });

  const idle = slime.onStateEnter("idle", async () => {
    slime.stop();
    await k.wait(0);
    slime.enterState(
      directionalStates[Math.floor(Math.random() * directionalStates.length)]
    );
  });

  const right = slime.onStateEnter("right", async () => {
    slime.flipX = false;
    playerAnimIfNotPlaying(slime, "slime-side");
    await k.wait(1);

    if (slime.getCollisions().length > 0) {
      slime.enterState("idle");
      return;
    }

    slime.enterState("idle");
  });

  const left = slime.onStateEnter("left", async () => {
    slime.flipX = true;
    playerAnimIfNotPlaying(slime, "slime-side");
    await k.wait(1);

    if (slime.getCollisions().length > 0) {
      slime.enterState("idle");
      return;
    }

    slime.enterState("idle");
  });

  const up = slime.onStateEnter("up", async () => {
    playerAnimIfNotPlaying(slime, "slime-up");
    await k.wait(1);

    if (slime.getCollisions().length > 0) {
      slime.enterState("idle");
      return;
    }

    slime.enterState("idle");
  });

  const down = slime.onStateEnter("down", async () => {
    playerAnimIfNotPlaying(slime, "slime-down");
    await k.wait(1);

    if (slime.getCollisions().length > 0) {
      slime.enterState("idle");
      return;
    }

    slime.enterState("idle");
  });

  k.onSceneLeave(() => {
    idle.cancel();
    right.cancel();
    left.cancel();
    up.cancel();
    down.cancel();
  });
}
