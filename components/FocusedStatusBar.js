import { StatusBar } from "react-native"
import { useIsFocused } from "@react-navigation/core"

const FocusedStatusBar = (prop) => {
    const isFocused = useIsFocused();
    return isFocused ? <StatusBar  animated={true} {...prop} translucent={false}/>:null;
}

export default FocusedStatusBar