import menuText3 from "../content/menuText3.js";
import { gameState } from "../state/stateManagers.js";
import { colorizeBackground } from "../utils.js";

export default function credits(k) {
  
  let currentLocale = "english"; // Default to English or another appropriate default

  colorizeBackground(k, 0, 0, 0);

  k.add([
    k.text(menuText3[currentLocale].title, { size: 72, font: "OldLondon" }),
    k.area(),
    k.anchor("center"),
    k.pos(k.width() / 2, k.height() / 1.3 - 265),
  ]);


  k.add([
    k.text(menuText3[currentLocale].playIndication, {
      size: 44,
      font: "OldLondon",
    }),
    k.area(),
    k.anchor("center"),
    k.pos(k.width() / 2, k.height() / 2 + 120),
  ]);

  k.onKeyPress("", () => {

    k.go("mainMenu");
  });

  k.onKeyPress("enter", () => {
    if (currentLocale === "french") {
      gameState.setFontSize(28); // Example function call based on locale
    }
    // k.go("world");
  });
}
