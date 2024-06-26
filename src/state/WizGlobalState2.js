export default function WizGlobalState2() {
    let instance = null;

    function createInstance() {
        let nbtalkedWiz = 0;
        return {
            setNbTalkedWiz(value) {
                nbtalkedWiz = value;
            },
            getNbTalkedWiz: () => nbtalkedWiz,
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
