import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useState, useEffect} from 'react';;

export type WorldClock = {
    name: string,
    timezone: string
}

export type ClocksContextProps = {
  clocks: WorldClock[],
  addClock(clock: WorldClock): void,
  removeClock(index: number): void
}

const ClocksContext = createContext<(ClocksContextProps)>({
  clocks: [],
  addClock: () => {},
  removeClock: () => {}
});

type Props = {
  children: React.ReactNode
}

export const ClocksProvider = ({
    children
}: Props) => {
  const [clocks, setClocks] = useState<WorldClock[]>([]);

  function addClock(clock: WorldClock) {
    setClocks((clocks) => {
        AsyncStorage.setItem('worldclocks', JSON.stringify(clocks.concat([clock])));
        return clocks.concat([clock]);
    })
  }

  function removeClock(index: number) {
    setClocks((clocks) => {
        if (index < clocks.length) {
            AsyncStorage.setItem('worldclocks', JSON.stringify(clocks.splice(index, 1)));
            return clocks.splice(index, 1);
        } else {
            return clocks;
        }
    })
  }

  useEffect(() => {
    const getClocks = async () => {
      try {
        const savedClocksString = await AsyncStorage.getItem('worldclocks');
        setClocks(JSON.parse(savedClocksString || '[]'));
      } catch (error) {
        console.log(error);
      }
    };

    getClocks();
  }, [])
  
  return (
    <ClocksContext.Provider value={{
      clocks: clocks,
      addClock: addClock,
      removeClock: removeClock
    }}>
      {children}
    </ClocksContext.Provider>
  );
};
export default ClocksContext;