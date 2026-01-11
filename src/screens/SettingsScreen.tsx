// src/screens/SettingsScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  AccessibilityInfo,
} from 'react-native';
import { colors } from '../theme/colors';

const SettingRow = ({
  title,
  description,
  value,
}: {
  title: string;
  description: string;
  value: boolean;
}) => (
  <View
    style={styles.settingRow}
    accessible
    accessibilityRole="switch"
    accessibilityLabel={title}
    accessibilityHint={description}>
    <View>
      <Text style={styles.settingTitle}>{title}</Text>
      <Text style={styles.settingDesc}>{description}</Text>
    </View>
    <Text style={styles.settingOnOff}>{value ? 'ON' : 'OFF'}</Text>
  </View>
);

export default function SettingsScreen() {
  useEffect(() => {
    AccessibilityInfo.announceForAccessibility('설정 페이지입니다.');
  }, []);

  return (
    <View style={styles.container}>
      <Text
        style={styles.title}
        accessible
        accessibilityRole="header"
        accessibilityLabel="설정">
        설정
      </Text>

      <Text style={styles.sectionHeader}>접근성</Text>

      <SettingRow
        title="화면 고대비"
        description="화면 요소를 더 선명하게 표시합니다."
        value={true}
      />
      <SettingRow
        title="큰 글씨"
        description="텍스트 크기를 더 크게 표시합니다."
        value={true}
      />
      <SettingRow
        title="진동 피드백"
        description="작업 완료 시 진동으로 알립니다."
        value={false}
      />

      <View
        style={styles.settingRow}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="음성 안내 속도"
        accessibilityHint="좌우로 스와이프해서 속도를 변경할 수 있습니다.">
        <View>
          <Text style={styles.settingTitle}>음성 안내 속도</Text>
          <Text style={styles.settingDesc}>음성 피드백의 속도 조절</Text>
        </View>
        <Text style={styles.settingOnOff}>보통</Text>
      </View>

      <Text style={[styles.sectionHeader, { marginTop: 24 }]}>앱 정보</Text>
      <View
        style={styles.settingRow}
        accessible
        accessibilityLabel="버전 정보, 버전 1.0.0">
        <View>
          <Text style={styles.settingTitle}>버전</Text>
          <Text style={styles.settingDesc}>v.1.0.0</Text>
        </View>
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
  sectionHeader: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: colors.border,
    borderWidth: 3,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    backgroundColor: colors.cardBackground,
  },
  settingTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  settingDesc: {
    color: colors.textNormal,
    fontSize: 13,
  },
  settingOnOff: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
