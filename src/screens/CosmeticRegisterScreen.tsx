/**
 * 📁 CosmeticRegisterScreen.tsx (최종본)
 * --------------------------------------------------
 * [촬영 전용 화면]
 * - 화장품 촬영 전용
 * - 정면 / 측면 / 상단 / 추가 사진 총 4장 촬영
 * - 4장 촬영 완료 시 CosmeticConfirmScreen으로 이동
 * - ❗ 촬영만 담당 (저장 X)
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useNavigation } from '@react-navigation/native';

const MAX_PHOTOS = 4;

const CAPTURE_GUIDE = [
  { title: '정면 촬영', desc: '화장품의 정면이 보이도록 촬영해주세요' },
  { title: '측면 촬영', desc: '화장품의 옆면이 보이도록 촬영해주세요' },
  { title: '상단 촬영', desc: '화장품의 위쪽이 보이도록 촬영해주세요' },
  { title: '추가 촬영', desc: '화장품의 특징이 잘 보이도록 촬영해주세요' },
];

export default function CosmeticRegisterScreen() {
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('back');
  const navigation = useNavigation<any>();

  const [photos, setPhotos] = useState<string[]>([]);
  const currentIndex = photos.length;

  const currentGuide =
    CAPTURE_GUIDE[currentIndex] ??
    CAPTURE_GUIDE[CAPTURE_GUIDE.length - 1];

  const handleCapture = async () => {
    if (!cameraRef.current || currentIndex >= MAX_PHOTOS) return;

    const photo = await cameraRef.current.takePhoto();
    const nextPhotos = [...photos, `file://${photo.path}`];
    setPhotos(nextPhotos);

    // ✅ 4장 촬영 완료 → 확인 화면 이동
    if (nextPhotos.length === MAX_PHOTOS) {
      navigation.navigate('CosmeticConfirm', {
        photos: nextPhotos,
      });
    }
  };

  if (!device) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#FFD400' }}>카메라 준비 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive
        photo
      />

      <View style={styles.topOverlay}>
        <Text style={styles.step}>
          {currentIndex + 1} / {MAX_PHOTOS}
        </Text>
        <Text style={styles.title}>{currentGuide.title}</Text>
        <Text style={styles.sub}>{currentGuide.desc}</Text>
      </View>

      {photos.length > 0 && (
        <View style={styles.thumbnailBox}>
          <Image
            source={{ uri: photos[photos.length - 1] }}
            style={styles.thumbnail}
          />
        </View>
      )}

      <TouchableOpacity
        style={styles.captureButton}
        onPress={handleCapture}
      >
        <Text style={styles.captureText}>촬영하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  topOverlay: {
    position: 'absolute',
    top: 0,
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },

  step: {
    color: '#FFD400',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },

  title: {
    color: '#FFD400',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },

  sub: {
    color: '#FFFFFF',
    fontSize: 14,
  },

  thumbnailBox: {
    position: 'absolute',
    bottom: 160,
    right: 20,
  },

  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFD400',
  },

  captureButton: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: '#FFD400',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 36,
  },

  captureText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
