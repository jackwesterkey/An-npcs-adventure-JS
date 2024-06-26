export default function oldManGlobalStateManager() {
    let instance = null;

    function createInstance() {
        let nbtalkedOldMan = 0;
        return {
            setNbTalkedOldMan(value) {
                nbtalkedOldMan = value;
            },
            getNbTalkedOldMan: () => nbtalkedOldMan,
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
