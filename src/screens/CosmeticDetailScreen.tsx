/**
 * CosmeticDetailScreen (최종본)
 * --------------------------------------------------
 * - MyPouch에서 선택한 화장품 상세 조회
 * - 화장품 1개 = 사진 여러 장 (보통 4장)
 * - 인증 토큰 포함 요청
 * - 로딩 / 에러 / 정상 상태 명확히 분리
 * - 추후 AI 분석 / 인식 화면으로 확장 가능
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

const API_BASE_URL = 'https://api.viewlulu.site';
const S3_BASE_URL = 'https://viewlulus3.s3.ap-northeast-2.amazonaws.com';

/* ===============================
 * 타입 정의 (최소 필수)
 * =============================== */

interface CosmeticPhoto {
  s3Key: string;
  originalName: string;
  mimeType: string;
}

interface CosmeticDetail {
  cosmeticId: number;
  cosmeticName: string;
  createdAt: string;
  photos: CosmeticPhoto[];
}

type RouteParams = {
  CosmeticDetail: {
    cosmeticId: number;
  };
};

const CosmeticDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'CosmeticDetail'>>();
  const { cosmeticId } = route.params;

  const [loading, setLoading] = useState(true);
  const [cosmetic, setCosmetic] = useState<CosmeticDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* ===============================
   * API 호출
   * =============================== */
  const fetchCosmeticDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem('accessToken');

      if (!token) {
        setError('로그인이 필요합니다.');
        return;
      }

      const res = await axios.get<CosmeticDetail>(
        `${API_BASE_URL}/cosmetics/${cosmeticId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCosmetic(res.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 404) {
          setError('화장품 정보를 찾을 수 없습니다.');
        } else if (status === 401) {
          setError('인증이 만료되었습니다. 다시 로그인해주세요.');
        } else {
          setError('화장품 정보를 불러오는 중 오류가 발생했습니다.');
        }

        console.error(
          '[CosmeticDetailScreen]',
          status,
          err.response?.data
        );
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
        console.error('[CosmeticDetailScreen][Unknown]', err);
      }
    } finally {
      setLoading(false);
    }
  }, [cosmeticId]);

  useEffect(() => {
    fetchCosmeticDetail();
  }, [fetchCosmeticDetail]);

  /* ===============================
   * 렌더링 분기
   * =============================== */

  // 로딩
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 에러
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← 뒤로가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 데이터 없음 (방어 코드)
  if (!cosmetic) {
    return (
      <View style={styles.center}>
        <Text>화장품 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  /* ===============================
   * 정상 화면
   * =============================== */

  return (
    <ScrollView style={styles.container}>
      {/* 뒤로가기 */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← 뒤로가기</Text>
      </TouchableOpacity>

      {/* 화장품 이름 */}
      <Text style={styles.name}>{cosmetic.cosmeticName}</Text>
      <Text style={styles.date}>
        등록일: {new Date(cosmetic.createdAt).toLocaleDateString()}
      </Text>

      {/* 사진 목록 */}
      <View style={styles.imageContainer}>
        {cosmetic.photos.map((photo, index) => (
          <Image
            key={index}
            source={{ uri: `${S3_BASE_URL}/${photo.s3Key}` }}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </View>

      {/* (확장 포인트) */}
      {/*
        여기 아래에:
        - 화장품 인식하기
        - AI 분석 결과
        - 성분 정보
        같은 버튼/정보 추가 가능
      */}
    </ScrollView>
  );
};

export default CosmeticDetailScreen;

/* ===============================
 * 스타일
 * =============================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backText: {
    fontSize: 16,
    marginBottom: 12,
    color: '#444',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  imageContainer: {
    gap: 12,
  },
  image: {
    width: '100%',
    height: 260,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  errorText: {
    fontSize: 16,
    color: '#c00',
    marginBottom: 12,
    textAlign: 'center',
  },
});
