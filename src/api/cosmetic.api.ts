/**
 * Cosmetic API (최종 안정본 + 디버그 로그 추가)
 * --------------------------------------------------
 * - 기존 API 절대 유지
 * - bulk / 그룹 기준 구조 반영
 * - 타입 불일치 정리
 * - ✅ FormData 업로드 안정화 (Content-Type 안전망)
 * - 🔥 createCosmeticApi 요청 단계 로그 추가
 */

import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';


/* ================= 공통 타입 ================= */

export type DetectCosmeticResponse = {
  detectedId: string;
};

/**
 * ❗ (기존) 단일 업로드 기반 아이템
 * - uploadCosmeticApi 등에서 여전히 사용 가능
 */
export type SingleCosmeticItem = {
  id: number;
  s3_key: string;
  created_at: string;
};

/**
 * ✅ (신규) MyPouch 그룹 기준 아이템
 * - GET /cosmetics/me 응답
 */
export type CosmeticGroupItem = {
  id: number;
  name: string;
  thumbnail: string;
  created_at: string;
};

/* ================= 화장품 인식 ================= */

export const detectCosmeticApi = async (photo: {
  uri: string;
  name: string;
  type: string;
}): Promise<DetectCosmeticResponse> => {
  const formData = new FormData();

  formData.append(
    'photo',
    {
      uri: photo.uri,
      name: photo.name,
      type: photo.type,
    } as any
  );

  const res = await api.post('/cosmetics/detect', formData, {
    headers: { 'Content-Type': undefined as any },
  });

  return res.data;
};

/* ================= 내 화장품 목록 (그룹 기준) ================= */

export const getMyCosmeticsApi = async (): Promise<CosmeticGroupItem[]> => {
  const res = await api.get('/cosmetics/me');
  return res.data;
};

/* ================= 단일 화장품 상세 ================= */

export type CosmeticDetail = {
  id: number;
  name: string;
  brand?: string;
  s3_key: string;
  created_at: string;
};

export const getCosmeticDetailApi = async (
  cosmeticId: string
): Promise<CosmeticDetail> => {
  const res = await api.get(`/cosmetics/${cosmeticId}`);
  return res.data;
};

/* ================= (기존) 단일 사진 업로드 ================= */
/* ❗ 절대 삭제 / 수정 금지 */

export const uploadCosmeticApi = async (photo: {
  uri: string;
  name: string;
  type: string;
}) => {
  const formData = new FormData();

  formData.append(
    'photo',
    {
      uri: photo.uri,
      name: photo.name,
      type: photo.type,
    } as any
  );

  const res = await api.post('/cosmetics', formData, {
    headers: { 'Content-Type': undefined as any },
  });

  return res.data;
};

/* ================= 🔥 신규: 화장품 1개 등록 (사진 여러 장) ================= */

export const createCosmeticApi = async ({
  name,
  images,
}: {
  name: string;
  images: string[];
}) => {
  console.log('🟡 createCosmeticApi(fetch) 호출');

  const formData = new FormData();
  formData.append('name', name.trim());

  images.forEach((uri, index) => {
    console.log(`📷 append photo ${index + 1}`, uri);

    formData.append('photo', {
      uri,
      name: `cosmetic_${index + 1}.jpg`,
      type: 'image/jpeg',
    } as any);
  });

  const token = await AsyncStorage.getItem('accessToken');

  console.log('🚀 fetch POST /cosmetics/bulk');

  const res = await fetch('http://viewlulu.site:3000/cosmetics/bulk', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // ❗ 절대 Content-Type 지정하지 말 것
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('❌ fetch 실패:', res.status, text);
    throw new Error(`Upload failed: ${res.status}`);
  }

  const data = await res.json();
  console.log('🟢 fetch 성공:', data);

  return data;
};