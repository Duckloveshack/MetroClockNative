import { Text, View } from "react-native"
import { useContext, useEffect, useState } from "react";
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";
import SimContext, { SimContextProps } from "../../context/SimContext";
import SectionTitle from "../elements/SectionTitle";
import SIMSwitch from "../elements/SIMSwitch";
import FontStyles from "../style/fonts";
import Colors from "../style/colors";
import { Trans, useTranslation } from "react-i18next";

function TitleSwitcher(): React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);
    const { sims, currentSim, simColors } = useContext<SimContextProps>(SimContext);
    const { t } = useTranslation(["common"]);

    useEffect(() => {

    }, [sims]);

    function fetchSIMName() {
        return sims[currentSim]?.displayName || t("common:noSim");
    }

    switch (sims.length) {
        case -1:
        case 0: {
            return (
                <SectionTitle title={t("common:noSim")}/>
            )
        }
        case 1: {
            return (
                <SectionTitle title={fetchSIMName()}/>
            )
        }
        default: {
            return(
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <SectionTitle title={t("common:appName").toUpperCase()} subtitle={
                        <Text style={[{
                            color: Colors[theme].secondary
                        }, FontStyles.sectionSubtitle]}>
                            <Trans
                                i18nKey={"multiSimCarrier"}
                                ns={"common"}
                                values={{
                                    carrier: fetchSIMName()
                                }}
                                components={[<Text style={{ color: simColors[currentSim] || Colors.accentColor }}/>]}
                            />
                        </Text>
                    }/>
                    <SIMSwitch/>
                </View>
            )
        }
    }
}

export default TitleSwitcher