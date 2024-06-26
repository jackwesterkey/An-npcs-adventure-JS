export default function playerGlobalStateManager() {
  let instance = null;

  function createInstance() {
      let isSwordEquipped = false;
      const maxHealth = 3;
      let health = maxHealth;
      let hasKey = false;
      let isMagicBullet = false;
      let isSWORD = false;

      return {
          setIsMagicBullet(value) {
              isMagicBullet = value;
          },
          getIsMagicBullet() {
              return isMagicBullet;
          },
          getMaxHealth() {
              return maxHealth;
          },
          setHealth(value) {
              health = value;
          },
          getHealth() {
              return health;
          },
          setIsSwordEquipped(value) {
              isSwordEquipped = value;
          },
          getIsSwordEquipped() {
              return isSwordEquipped;
          },
          setHasKey(value) {
              hasKey = value;
          },
          getHasKey() {
              return hasKey;
          },
          setIsSWORD(value) {
              isSWORD = value;
          },
          getIsSWORD() {
              return isSWORD;
          }
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
