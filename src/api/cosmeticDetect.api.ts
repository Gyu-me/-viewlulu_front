/**
 * cosmeticDetect.api.ts (FINAL STABLE)
 * --------------------------------------------------
 * ✅ 프론트는 Node만 호출
 * ✅ POST /cosmetics/detect
 * ✅ field name: photo (multer upload.single('photo')와 정확히 일치)
 * ✅ Android Network Error 방어용 옵션 포함
 */

import { api } from './api';

export type DetectCosmeticResponse = {
  detectedId: string;
  bestDistance?: number;
  top5?: { product_id: string; score: number }[];
  source?: 'python' | 'ahash';
};

export const detectCosmeticApi = async (photo: {
  uri: string;
  name: string;
  type: string;
}): Promise<DetectCosmeticResponse> => {
  const formData = new FormData();

  // 🔑 multer가 받는 field name = 'photo'
  formData.append('photo', {
    uri: photo.uri,
    name: photo.name,
    type: photo.type,
  } as any);

  try {
    const res = await api.post('/cosmetics/detect', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // 🔥 Android에서 무한 대기 → Network Error 방지
      timeout: 30_000,
    });

    return res.data as DetectCosmeticResponse;
  } catch (err: any) {
    // ❗ 여기서 에러를 삼키지 말고 그대로 던져야
    // DetectScreen의 catch에서 Alert가 정상 작동함
    console.error('[detectCosmeticApi]', err?.message ?? err);
    throw err;
  }
};
