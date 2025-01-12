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

export type SimContextProps = Array<SimObjectProps>;

const SimContext = createContext<SimContextProps>([]);

type Props = {
  children: React.ReactNode
}

export const SimProvider = ({
    children
}: Props) => {
  const [sims, setSims] = useState<SimContextProps>([]);

  useEffect(() => {
    async function fetchSimData() {
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
    <SimContext.Provider value={sims}>
      {children}
    </SimContext.Provider>
  );
};
export default SimContext;