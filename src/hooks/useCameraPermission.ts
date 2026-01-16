/**
 * useCameraPermission
 * --------------------------------------------------
 * - 카메라 권한 상태를 공통으로 관리
 * - 최초 진입 시 OS 권한 팝업 자동 호출
 * - 영구 거부 상태에서는 설정 이동 UX 제공
 *
 * ❗ 모든 카메라 화면에서 공통 사용
 */

import { useEffect, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { Camera } from 'react-native-vision-camera';

export type CameraPermissionStatus =
  | 'authorized'
  | 'denied'
  | 'not-determined';

export function useCameraPermission() {
  const [status, setStatus] =
    useState<CameraPermissionStatus>('not-determined');

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      // 🔍 현재 권한 상태 확인
      const current = await Camera.getCameraPermissionStatus();

      // 🔔 최초 요청 상태면 OS 팝업 자동 호출
      if (current === 'not-determined') {
        const requested = await Camera.requestCameraPermission();
        setStatus(requested);
      } else {
        setStatus(current);
      }

      setChecked(true);
    };

    checkPermission();
  }, []);

  /**
   * 설정 앱으로 이동 (영구 거부 대응)
   */
  const openSettings = () => {
    Alert.alert(
      '카메라 권한 필요',
      '카메라 기능을 사용하려면 권한이 필요합니다.\n설정 화면으로 이동할까요?',
      [
        { text: '취소', style: 'cancel' },
        { text: '설정으로 이동', onPress: Linking.openSettings },
      ],
    );
  };

  return {
    checked,                 // 권한 체크 완료 여부
    status,                  // 현재 권한 상태
    isAuthorized: status === 'authorized',
    openSettings,            // 설정 이동 함수
  };
}
