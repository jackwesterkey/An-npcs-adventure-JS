import { gameState } from "../state/stateManagers.js";

async function displayLine(textContainer, line) {
    for (const char of line) {
        await new Promise((resolve) => {
            setTimeout(() => {
                textContainer.text += char;
                resolve();
            }, 10);
        });
    }
}

export async function dialog(k, pos, content) {
    gameState.setFreezePlayer(true); // Fixed typo from 'setFreesePlayer' to 'setFreezePlayer'

    const dialogBox = k.add([
        k.rect(700, 150),
        k.pos(pos),
        k.fixed()
    ]);
    
    const textContainer = dialogBox.add([
        k.text("", {
            font: "OldLondon",
            width: 700,
            lineSpacing: 15,
            size: gameState.getFontSize(),
        }),
        k.color(27, 29, 52),
        k.pos(30, 20),
        k.fixed(),
    ]);

    let index = 0;
    let lineFinishedDisplayed = true;

    await displayLine(textContainer, content[index]);
    lineFinishedDisplayed = true;

    const dialogKey = k.onKeyPress("space", async () => {
        if (!lineFinishedDisplayed) return;

        index++;
        if (!content[index]) {
            k.destroy(dialogBox);
            dialogKey.cancel();
            gameState.setFreezePlayer(false);
            return;
        }
        textContainer.text = "";
        lineFinishedDisplayed = false;
        await displayLine(textContainer, content[index]);
        lineFinishedDisplayed = true;
    });
}
