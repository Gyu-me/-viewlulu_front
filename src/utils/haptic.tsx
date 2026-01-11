/**
 * haptic.ts
 * ----------------------------
 * 안전한 진동 유틸 (RN 기본 API)
 */
import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { triggerVibration } from '../utils/haptic';
import { useSettings } from '../context/SettingsContext';

type Props = TouchableOpacityProps & {
  children: React.ReactNode;
};

export default function HapticTouchable({ onPress, children, ...rest }: Props) {
  // 1. Context에서 현재 진동 설정 상태를 가져옵니다.
  const { vibrationEnabled } = useSettings();

  const handlePress: TouchableOpacityProps['onPress'] = (e) => {
    /* [수정 및 점검 포인트]
      vibrationEnabled가 명확하게 'true'일 때만 진동이 발생하도록 보장합니다.
      만약 Context 초기값이 undefined이거나 null인 경우 진동이 울리지 않게 방어 로직을 거칩니다.
    */
    if (vibrationEnabled === true) {
      triggerVibration();
    }

    onPress?.(e);
  };

  return (
    <TouchableOpacity
      {...rest}
      onPress={handlePress}
    >
      {children}
    </TouchableOpacity>
  );
}