export default function globalStateManager() {
  let instance = null;
  
    function createInstance() {
      let previousScene = null;
      let freezePlayer = false;
      let fontSize = 42;
      let isGhostDefeated = false;
      let isSonSaved = false;
  
      return {
        setPreviousScene(sceneName) {
          previousScene = sceneName;
        },
        getPreviousScene() {
          return previousScene;
        },
        setFreezePlayer(value) {
          freezePlayer = value;
        },
        getFreezePlayer() {
          return freezePlayer;
        },
        setFontSize(value) {
          fontSize = value;
        },
        getFontSize() {
          return fontSize;
        },
        setIsGhostDefeated(value) {
          isGhostDefeated = value;
        },
        getIsGhostDefeated() {
          return isGhostDefeated;
        },
        setIsSonSaved(value) {
          isSonSaved = value;
        },
        getIsSonSaved() {
          return isSonSaved;
        },
      };
    }
  
    return {
      getInstance() {
        if (!instance) {
          instance = createInstance();
        }
        return instance;
      },
    };
  }
  
