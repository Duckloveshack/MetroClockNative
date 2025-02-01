import React, {createContext, useState, useEffect} from 'react';
import SimCardsManagerModule from 'react-native-sim-cards-manager';
import { BackHandler, PermissionsAndroid, NativeModules } from 'react-native';
import _ from 'lodash';
import { navigationRef } from '../App';
import { ModalButton } from '../components/elements/Button';

const { MiscBridgeModule } = NativeModules;

type SimObjectProps = {
    carrierName: string,
    displayName: string,
    isoCountryCode: string,
    mobileCountryCode: number,
    mobileNetworkCode: number,
    isDataRoaming: 0 | 1,
    isNetworkRoaming: 0 | 1,
    simSlotIndex: 0,
    phoneNumber: string,
    simSerialNumber: string,
    subscriptionId: number
}

export type SimContextProps = {
  sims: Array<SimObjectProps>,
  currentSim: number,
  setSimIndex: (index: number) => void,
  simColors: Array<string>
};

const SimContext = createContext<SimContextProps>({
  sims: [],
  currentSim: 0,
  setSimIndex: (index: number) => {},
  simColors: []
})

type Props = {
  children: React.ReactNode
}

export const SimProvider = ({
    children
}: Props) => {
  const [sims, setSims] = useState<Array<SimObjectProps>>([]);
  const [currentSim, setCurrentSim] = useState<number>(0);
  const [simColors, setSimColors] = useState<Array<string>>([
    "#cc1050",
    "#70aa30"
  ])

  function setSimIndex(index:number):void {
    setCurrentSim((previousIndex:number) => {
      if (index < sims.length && index >= 0 && previousIndex !== index) {
        return index;
      } else {
        return previousIndex;
      }
    });
  }

  useEffect(() => {
    async function fetchSimData() {
      SimCardsManagerModule.getSimCardsNative().then((simArray: Array<any>) => {
        setSims((previousSims) => {
          if (_.isEqual(previousSims, simArray)) {
            return previousSims;
          } else {
            return simArray;
          }
        });
      }).catch((error) => {
        console.error(error);
      }); 
    }

    let fetchingInterval:any = undefined;

    async function simPermission() {
      const grantedState = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE);
      const grantedNumber = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS);

      if (!grantedState || !grantedNumber) {
        navigationRef.navigate(("ModalScreen"), {
          title: "Permission required",
          subtitle: "Metro Dialer needs phone access in order to be able to fetch SIM data.",
          components: [
            <ModalButton
              text='grant'
              onPress={async () => {
                const granted = await PermissionsAndroid.requestMultiple([
                  PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
                  PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS
                ]);

                if (granted['android.permission.READ_PHONE_NUMBERS'] == "granted" && granted['android.permission.READ_PHONE_STATE'] == "granted") {
                  fetchSimData();
                  fetchingInterval = setInterval(fetchSimData, 10000);
                }

                navigationRef.goBack();
              }}
            />,
            // <ModalButton
            //   text='dismiss'
            //   onPress={() => {
            //     navigationRef.goBack();
            //   }}
            // />,
            <ModalButton
              text='quit'
              onPress={() => {
                navigationRef.goBack();
                MiscBridgeModule.exitApp();
              }}
            />
          ]
        })
      } else {
        fetchSimData();
        fetchingInterval = setInterval(fetchSimData, 10000);
      }
    }

    setTimeout(simPermission, 1500);

    //fetchSimData();

    //const fetchingInterval = setInterval(fetchSimData, 10000);

    return () => { clearInterval(fetchingInterval) };
  }, []);

  return (
    <SimContext.Provider value={{
      sims: sims,
      currentSim: currentSim,
      setSimIndex: setSimIndex,
      simColors: simColors
    }}>
      {children}
    </SimContext.Provider>
  );
};
export default SimContext;