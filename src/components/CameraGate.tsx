/**
 * CameraGate.tsx
 * --------------------------------------------------
 * - 카메라 권한 공통 Gate
 * - iOS / Android 권한 문자열 차이 대응
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { Camera } from 'react-native-vision-camera';

type Permission =
  | 'authorized'
  | 'granted'
  | 'denied'
  | 'not-determined'
  | 'restricted'
  | null;

export default function CameraGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [permission, setPermission] = useState<Permission>(null);

  useEffect(() => {
    (async () => {
      const status = await Camera.getCameraPermissionStatus();
      setPermission(status);
    })();
  }, []);

  // 🔥 iOS / Android 모두 허용 처리
  const isAllowed =
    permission === 'authorized' || permission === 'granted';

  if (isAllowed) {
    return <>{children}</>;
  }

  if (permission === 'not-determined') {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>카메라 권한을 요청 중입니다...</Text>
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Text style={styles.text}>
        카메라 권한이 필요합니다.{'\n'}
        설정에서 권한을 허용해주세요.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => Linking.openSettings()}
      >
        <Text style={styles.buttonText}>설정으로 이동</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  text: {
    color: '#FFD400',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FFD400',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
