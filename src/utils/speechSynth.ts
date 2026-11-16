// Simulated speech playback (does not touch browser speech hardware to avoid any lag)

export const speakEnglish = (_text: string, onEnd?: () => void) => {
  if (onEnd) {
    setTimeout(onEnd, 300);
  }
};
