import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { triggerVibration } from '../utils/haptic';
import { useSettings } from '../context/SettingsContext';

type Props = TouchableOpacityProps & {
  children: React.ReactNode;
};

export default function HapticTouchable({ onPress, children, ...rest }: Props) {
  const { vibrationEnabled } = useSettings();

  const handlePress: TouchableOpacityProps['onPress'] = (e) => {
    if (vibrationEnabled) triggerVibration();
    onPress?.(e);
  };

  return (
    <TouchableOpacity {...rest} onPress={handlePress}>
      {children}
    </TouchableOpacity>
  );
}
