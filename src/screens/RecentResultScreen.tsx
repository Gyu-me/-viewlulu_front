/**
 * RecentResultScreen
 * ----------------------------
 * 최근 분석 결과 확인 화면
 *
 * 기능
 * - 최근 피부 분석 결과 카드
 * - 최근 얼굴형 분석 결과 카드
 * - 카드 클릭 시 상세 결과 화면 이동
 * - 저장된 결과가 없을 경우 안내 표시
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RecentResultScreen() {
  const navigation = useNavigation<any>();

  // 🔥 나중에 AsyncStorage / DB 연동 예정
  const skinResult = {
    type: '복합성',
    summary: '이마·볼 여드름, 턱 홍조',
    date: '2025.01.09',
  };

  const faceResult = {
    top1: '계란형',
    top2: '둥근형',
    date: '2025.01.09',
  };

  return (
    <View style={styles.container}>
      {/* ================= 제목 ================= */}
      <Text style={styles.pageTitle}>최근 분석 결과</Text>

      <ScrollView contentContainerStyle={styles.content}>
        {/* ================= 피부 분석 카드 ================= */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('SkinResult')}
        >
          <Text style={styles.cardTitle}>피부 분석</Text>

          <Text style={styles.mainText}>{skinResult.type}</Text>
          <Text style={styles.subText}>{skinResult.summary}</Text>

          <Text style={styles.dateText}>
            마지막 분석: {skinResult.date}
          </Text>
        </TouchableOpacity>

        {/* ================= 얼굴형 분석 카드 ================= */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('FaceResult')}
        >
          <Text style={styles.cardTitle}>얼굴형 분석</Text>

          <Text style={styles.mainText}>
            {faceResult.top1} · {faceResult.top2}
          </Text>

          <Text style={styles.subText}>
            가장 유력한 얼굴형 2가지
          </Text>

          <Text style={styles.dateText}>
            마지막 분석: {faceResult.date}
          </Text>
        </TouchableOpacity>

        {/* ================= 결과 없음 안내 (예시) ================= */}
        {false && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              아직 저장된 분석 결과가 없습니다.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ================= 스타일 ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  pageTitle: {
    color: '#FFD400',
    fontSize: 26,
    fontWeight: '800',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
  },

  content: {
    padding: 20,
    paddingBottom: 120,
  },

  card: {
    borderWidth: 2,
    borderColor: '#FFD400',
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
  },

  cardTitle: {
    color: '#FFD400',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
  },

  mainText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },

  subText: {
    color: '#DDD',
    fontSize: 14,
    marginBottom: 12,
  },

  dateText: {
    color: '#999',
    fontSize: 12,
  },

  emptyBox: {
    borderWidth: 2,
    borderColor: '#444',
    borderRadius: 18,
    padding: 30,
    alignItems: 'center',
  },

  emptyText: {
    color: '#888',
    fontSize: 14,
  },
});
