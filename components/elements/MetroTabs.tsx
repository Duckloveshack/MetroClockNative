import { View } from "react-native"

type Attributes = {
    screens: Array<{
        key: number,
        title: string,
        screen: React.ReactNode
    }>
}

function MetroTabs({
    screens: []
}: Attributes): React.JSX.Element {
    return (
        <View>
            
        </View>
    )
}

export default MetroTabs;