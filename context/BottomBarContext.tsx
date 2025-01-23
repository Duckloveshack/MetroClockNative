import React, {createContext, useState} from 'react';
import _ from 'lodash';

type controlProps = Array<{
    icon: string,
    string: string,
    disabled?: boolean,
    onPress?: () => any
}>

type optionProps = Array<{
    string: string,
    disabled?: boolean,
    onPress?: () => any
}>

type setBarProps = {
    controls: controlProps,
    options: optionProps,
    hidden?: boolean
}

export type BottomBarContextProps = {
  controls: controlProps,
  options: optionProps,
  hidden: boolean,
  setBar: ({controls, options, hidden}: setBarProps) => void,
}

const BottomBarContext = createContext<BottomBarContextProps>({
  controls: [],
  options: [],
  hidden: false,
  setBar: ({ controls, options, hidden }) => {},
});

type Props = {
  children: React.ReactNode
}

export const BottomBarProvider = ({
    children
}: Props) => {
  const [controls, setControls] = useState<controlProps>([]);
  const [options, setOptions] = useState<optionProps>([]);
  const [hidden, setHidden] = useState<boolean>(false);

  function setBar({ controls, options, hidden=false }: setBarProps): void {
    setControls((oldControls) => {
        if (_.isEqual(controls, oldControls)) {
            return oldControls;
        } else {
            return controls;
        }
    });
    setControls(controls)
    setOptions((oldOptions) => {
        if (_.isEqual(options, oldOptions)) {
            return oldOptions;
        } else {
            return options;
        }
    });
    setHidden((oldHidden) => {
        if (oldHidden === hidden) {
            return oldHidden;
        } else {
            return hidden;
        }
    });
  }

  return (
    <BottomBarContext.Provider value={{
        controls: controls,
        options: options,
        hidden: hidden,
        setBar: setBar
    }}>
      {children}
    </BottomBarContext.Provider>
  );
};
export default BottomBarContext;