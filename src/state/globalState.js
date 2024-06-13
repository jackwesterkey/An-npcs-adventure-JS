export default function globalStateManager() {
     let instance = null;
     
     function createInstance () {
         let frezePlayer = false;
         let fontSize = 42;

         return {
            setFreezePlayer (value) {
              frezePlayer = value;
            },
            getFreezePlayer: ()  => frezePlayer,
            setFontSize(value) {
                fontSize = value;
            },
            getFontSize: () =>  fontSize,
         };
     }

 return {
    getInstance () {
    if(!instance) {
        instance = createInstance();
    }
    return instance;
    },
 };
}