import React, {createContext, useState, useEffect} from 'react';
import SimCardsManagerModule from 'react-native-sim-cards-manager';
import _ from 'lodash';

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
      //needs to be rewritten so it isn't annoying af-
      SimCardsManagerModule.getSimCards({
        title: 'Permission Required',
        message: 'Metro Dialer requires Phone permissions to fetch SIM data, create and manage calls, etc.',
        buttonPositive: "Got it",
        buttonNegative: "No way!",
        buttonNeutral: "Ask me later"
      }).then((simArray: Array<any>) => {
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

    fetchSimData();

    const fetchingInterval = setInterval(fetchSimData, 10000);

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