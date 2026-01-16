/**
 * CosmeticDetectScreen (FINAL + DEBUG SAFE)
 * --------------------------------------------------
 * ✅ Hook 순서 고정 (React 규칙 100% 준수)
 * ✅ Camera lifecycle 안전
 * ✅ Node(/cosmetics/detect)만 호출
 * ✅ 디버그 로그 유지
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { colors } from '../theme/colors';
import { detectCosmeticApi } from '../api/cosmeticDetect.api';
import { api } from '../api/api';

/* ================= DEBUG ================= */

const now = () => new Date().toISOString().slice(11, 23);
const log = (...a: any[]) => console.log(`[${now()}][Detect]`, ...a);
const errlog = (...a: any[]) => console.error(`[${now()}][Detect][ERR]`, ...a);

/* ================= Component ================= */

export default function CosmeticDetectScreen() {
  const navigation = useNavigation<any>();
  const cameraRef = useRef<Camera>(null);

  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);

  /* ✅ 모든 Hook은 return 위에서 고정 */

  useEffect(() => {
    log('mount', { baseURL: api?.defaults?.baseURL });
    return () => log('unmount');
  }, []);

  useEffect(() => {
    log('permission', hasPermission);
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  useEffect(() => {
    log('state', { isActive, loading });
  }, [isActive, loading]);

  useFocusEffect(
    useCallback(() => {
      log('focus ON');
      setIsActive(true);
      return () => {
        log('focus OFF');
        setIsActive(false);
      };
    }, [])
  );

  /* ================= Capture ================= */

  const handleCapture = async () => {
    if (loading || !cameraRef.current) return;

    try {
      setLoading(true);
      log('capture start');

      const photo = await cameraRef.current.takePhoto({ flash: 'off' });
      log('photo', photo.path);

      const payload = {
        uri: `file://${photo.path}`,
        name: 'capture.jpg',
        type: 'image/jpeg',
      };

      log('payload', payload);

      const result = await detectCosmeticApi(payload);
      log('result', result);

      navigation.replace('CosmeticDetectResult', {
        cosmeticId: result.detectedId,
        source: result.source,
        bestDistance: result.bestDistance,
        top5: result.top5,
      });
    } catch (e: any) {
      errlog('detect error', e?.message, e);
      Alert.alert('인식 실패', e?.message ?? 'Network Error');
    } finally {
      setLoading(false);
      log('capture end');
    }
  };

  /* ================= Render ================= */

  let content: React.ReactNode;

  if (!hasPermission) {
    content = (
      <View style={styles.center}>
        <Text style={styles.text}>카메라 권한이 필요합니다.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={requestPermission}>
          <Text style={styles.primaryText}>권한 허용</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (!device) {
    content = (
      <View style={styles.center}>
        <Text style={styles.text}>카메라 로딩 중...</Text>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  } else {
    content = (
      <>
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive}
          photo
        />
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleCapture}
            disabled={loading}
          >
            <Text>{loading ? '인식 중...' : '촬영하기'}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return <View style={styles.container}>{content}</View>;
}

/* ================= Styles ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: { color: '#fff', fontSize: 15, textAlign: 'center' },
  primaryBtn: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryText: { color: '#000', fontWeight: '700' },
  overlay: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  guide: { color: colors.primary, fontSize: 16, marginBottom: 20 },
  captureButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
  },
  captureText: { color: '#000', fontWeight: '700', fontSize: 16 },
});
