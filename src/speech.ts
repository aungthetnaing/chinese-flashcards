import * as Speech from "expo-speech";

/**
 * Speak Chinese text aloud using the device's built-in Mandarin voice.
 * `zh-CN` maps to the system's Chinese text-to-speech engine on iOS/Android.
 */
export function speakChinese(text: string): void {
  if (!text) {
    return;
  }
  Speech.stop();
  Speech.speak(text, {
    language: "zh-CN",
    rate: 0.85,
    pitch: 1.0,
  });
}

export function stopSpeaking(): void {
  Speech.stop();
}
