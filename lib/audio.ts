/**
 * Utility for playing sounds and pronouncing text using the Web Speech API and Web Audio API.
 */

class AudioService {
  private audioContext: AudioContext | null = null;

  private initAudio() {
    if (!this.audioContext && typeof window !== "undefined") {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
    if (this.audioContext?.state === "suspended") {
      this.audioContext.resume();
    }
  }

  /**
   * Pronounces the given text using the Web Speech API.
   */
  speak(
    text: string,
    options: { lang?: string; cancel?: boolean; onEnd?: () => void } = {},
  ) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const { lang = "en-US", cancel = true, onEnd } = options;

    if (cancel) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    if (onEnd) {
      utterance.onend = onEnd;
    }

    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();

      if (voices.length === 0) return false;

      const targetLang = lang.split("-")[0];

      // Look for a high-quality voice for the target language
      const matchingVoice =
        voices.find(
          (v) => v.lang.startsWith(targetLang) && v.name.includes("Natural"),
        ) || // Edge Natural
        voices.find(
          (v) => v.lang.startsWith(targetLang) && v.name.includes("Online"),
        ) || // Edge Online
        voices.find(
          (v) => v.lang.startsWith(targetLang) && v.name.includes("Google"),
        ) || // Chrome Google
        voices.find(
          (v) => v.lang.startsWith(targetLang) && v.name.includes("Premium"),
        ) || // macOS Premium
        voices.find((v) => v.lang.startsWith(targetLang)); // Any matching language

      if (matchingVoice) {
        utterance.voice = matchingVoice;

        return true;
      }

      return false;
    };

    if (!setVoice()) {
      // If voices are not yet loaded, wait for them
      window.speechSynthesis.onvoiceschanged = () => {
        setVoice();
        window.speechSynthesis.speak(utterance);
        // Clear listener to avoid multiple speaks
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      window.speechSynthesis.speak(utterance);
    }
  }

  /**
   * Plays a positive "success" sound using oscillators.
   */
  playSuccess() {
    this.initAudio();
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(
      880,
      this.audioContext.currentTime + 0.1,
    ); // A5

    gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.3,
    );

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.3);
  }

  /**
   * Plays a negative "error" sound using oscillators.
   */
  playError() {
    this.initAudio();
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, this.audioContext.currentTime); // A3
    osc.frequency.linearRampToValueAtTime(
      110,
      this.audioContext.currentTime + 0.2,
    ); // A2

    gain.gain.setValueAtTime(0.05, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.3,
    );

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.3);
  }
}

export const audioService = new AudioService();
