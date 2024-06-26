import globalStateManager from "./globalState.js";
import oldManGlobalStateManager from "./oldManglobalState.js";
import playerGlobalStateManager from "./playerGlobalState.js";
import WizGlobalState from "./WizGlobalState.js";
import WizGlobalState2 from "./WizGlobalState2.js";

export const gameState = globalStateManager().getInstance();
export const oldManState = oldManGlobalStateManager().getInstance();
export const playerState = playerGlobalStateManager().getInstance();
export const WizState = WizGlobalState().getInstance();
export const WizState2 = WizGlobalState2().getInstance();