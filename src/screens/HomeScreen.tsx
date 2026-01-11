// src/screens/HomeScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AccessibilityInfo,
} from 'react-native';
import { colors } from '../theme/colors';

const MenuButton = ({
  label,
  description,
  onPress,
}: {
  label: string;
  description: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    style={styles.menuButton}
    onPress={onPress}
    accessible
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityHint={description}>
    <Text style={styles.menuTitle}>{label}</Text>
    <Text style={styles.menuDesc}>{description}</Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  useEffect(() => {
    AccessibilityInfo.announceForAccessibility('홈 페이지입니다.');
  }, []);

  return (
    <View style={styles.container}>
      <Text
        style={styles.title}
        accessible
        accessibilityRole="header"
        accessibilityLabel="뷰루루 홈">
        뷰루루
      </Text>

      <View style={styles.menuGrid}>
        <MenuButton
          label="화장품 등록"
          description="카메라로 화장품을 찍어 등록합니다."
        />
        <MenuButton
          label="음성 명령"
          description="음성으로 명령을 내려 사용할 수 있습니다."
        />
        <MenuButton
          label="얼굴형 분석"
          description="얼굴을 촬영해 얼굴형을 분석합니다."
        />
        <MenuButton
          label="피부 분석"
          description="피부 상태를 촬영해 분석합니다."
        />
      </View>

      <View
        style={styles.resultBox}
        accessible
        accessibilityRole="summary"
        accessibilityLabel="최근 분석 결과">
        <Text style={styles.sectionTitle}>최근 분석 결과</Text>
        <Text style={styles.resultText}>이마: 여드름이 관찰됩니다.</Text>
        <Text style={styles.resultText}>양 볼: 건조함 00%.</Text>
        <Text style={styles.resultText}>…</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 24,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuButton: {
    width: '48%',
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
    borderWidth: 3,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  menuTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  menuDesc: {
    color: colors.textNormal,
    fontSize: 13,
  },
  resultBox: {
    marginTop: 24,
    borderColor: colors.border,
    borderWidth: 3,
    borderRadius: 16,
    padding: 16,
    backgroundColor: colors.cardBackground,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  resultText: {
    color: colors.textNormal,
    fontSize: 14,
    marginBottom: 4,
  },
});
