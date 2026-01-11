/**
 * auth.api.ts 인증 API (최종본)
 * ----------------------------------------
 * - 로그인
 * - 회원가입
 * - ✅ 인증 서버(HTTPS) 전용 axios 사용
 *   baseURL: https://viewlulu.site
 *
 * ⚠️ 주의:
 * - 인증 요청은 토큰이 필요 없으므로 interceptor/Authorization 불필요
 */

import { authApi } from './authApi';

/* ================= 타입 ================= */

/**
 * 공통 사용자 타입
 */
export type AuthUser = {
  id: number;
  email: string;
  name: string;
};

/**
 * 로그인 응답
 */
export type LoginResponse = {
  token: string;
  user: AuthUser;
};

/**
 * 회원가입 요청
 * 🔴 백엔드 스펙과 반드시 일치
 */
export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: '남' | '여';
};

/**
 * 회원가입 응답
 */
export type RegisterResponse = AuthUser;

/* ================= API ================= */

/**
 * 로그인
 * POST /auth/login
 */
export const loginApi = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const res = await authApi.post<LoginResponse>('/auth/login', {
    email,
    password,
  });

  return res.data;
};

/**
 * 회원가입
 * POST /auth/register
 */
export const registerApi = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const res = await authApi.post<RegisterResponse>('/auth/register', {
    name: data.name,
    email: data.email,
    password: data.password,
    age: data.age,
    gender: data.gender,
  });

  return res.data;
};
