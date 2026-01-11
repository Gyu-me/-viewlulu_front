/**
 * api.ts
 * axios 공통 클라이언트 (서비스 API 전용 최종 안정본)
 * --------------------------------------------------
 * - baseURL: .env의 API_BASE_URL
 * - Authorization 헤더 자동 주입
 * - ❗ FormData 요청 시 axios 자동 변환 방지
 *
 * ✅ 핵심 포인트
 * - Content-Type을 전역으로 절대 고정하지 않음
 * - FormData 요청은 transformRequest 차단
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';

/* ================= 환경변수 체크 ================= */

if (!API_BASE_URL) {
  console.warn(
    '[api] API_BASE_URL is empty. Check your .env and babel dotenv config.',
  );
}

/* ================= axios 인스턴스 ================= */

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,

  /**
   * ❗ 중요
   * axios가 FormData를 application/x-www-form-urlencoded로
   * 변환해버리는 문제를 막기 위한 기본 설정
   */
  transformRequest: (data, headers) => {
    // FormData면 그대로 통과 (변형 ❌)
    if (data instanceof FormData) {
      return data;
    }

    // JSON 요청은 axios 기본 처리
    return data;
  },
});

/* ================= 요청 인터셉터 ================= */

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('accessToken');

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    /**
     * ✅ FormData 요청 안전 처리
     * - Content-Type을 강제로 지정하지 않음
     * - axios가 boundary 포함해서 자동 세팅하도록 둔다
     */
    if (config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers['Content-Type'];
      }
    }

    return config;
  },
  error => Promise.reject(error),
);

/* ================= 디버그 ================= */

console.log('🔥 API_BASE_URL:', API_BASE_URL);
