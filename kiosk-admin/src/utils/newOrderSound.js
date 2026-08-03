let audioContext;

const getAudioContext = () => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    throw new Error("이 브라우저는 알림음 재생을 지원하지 않습니다.");
  }

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  return audioContext;
};

const playTone = (context, frequency, startTime, duration) => {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    startTime + duration,
  );

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
};

export const playNewOrderSound = async () => {
  const context = getAudioContext();

  if (context.state === "suspended") {
    await context.resume();
  }

  const startTime = context.currentTime + 0.02;

  playTone(context, 880, startTime, 0.18);
  playTone(context, 1174.66, startTime + 0.17, 0.3);
};
