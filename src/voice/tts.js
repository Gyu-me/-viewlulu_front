import Tts from 'react-native-tts';
import { AppState } from 'react-native';

let ttsReady = false;
let isAppActive = true; // 🔥 핵심 플래그
let currentRate = 0.45;

/**
 * 앱 시작 시 한 번 호출
 */
export async function initTTS() {
  try {
    await Tts.setDefaultLanguage('ko-KR');
    await Tts.setDefaultRate(0.45);
    await Tts.setDefaultPitch(1.0);
    ttsReady = true;

    // 🔥 AppState 감시
    AppState.addEventListener('change', state => {
      isAppActive = state === 'active';

      if (!isAppActive) {
        Tts.stop(); // 앱 나가는 즉시 무조건 중단
      }
    });
  } catch (e) {
    ttsReady = false;
  }
}

/** 🔥 추가: 음성 속도 변경 */
export function setTtsRate(rate: number) {
  currentRate = rate;
  Tts.setDefaultRate(rate);
}

/**
 * 음성 출력
 */
export function speak(text: string) {
  if (!ttsReady || !text) return;

  // 🚫 앱이 active 아닐 땐 절대 말 안 함
  if (!isAppActive) return;

  Tts.stop();
  Tts.speak(text);
}

/**
 * 화면 설명 전용
 */
export function announceScreen(title: string, guide?: string) {
  const message = guide ? `${title}. ${guide}` : `${title}.`;
  speak(message);
}

/**
 * 강제 중단
 */
export function stopTts() {
  Tts.stop();
}
