import { SafeAreaProvider } from "react-native-safe-area-context";
import DialScreenInternal from "./screens/screenlets/DialScreenInternal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";
import BootSplash from "react-native-bootsplash";
import { ThemeProvider } from "./context/ThemeContext";
import { SimProvider } from "./context/SimContext";
import CallScreen from "./screens/CallScreen";

function CallApp({
  //passed through Intent
  //todo: check if its valid
  number = ""
}): React.JSX.Element {
    useEffect(() => {
        const init = async () => {
          // …do multiple sync or async tasks
        };
    
        init().finally(async () => {
          await BootSplash.hide();
        });
      }, []);

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView>
              <ThemeProvider>
                <SimProvider>
                  <CallScreen/>
                </SimProvider>
              </ThemeProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    )
}

export default CallApp; 