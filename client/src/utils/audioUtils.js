// Audio utility for creating sound effects
const createBeepSound = (frequency = 800, duration = 200, type = 'sine') => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration / 1000);
  
  return oscillator;
};

export const playOpenSound = () => {
  try {
    createBeepSound(600, 150, 'sine');
  } catch (error) {
    console.warn('Audio context not available');
  }
};

export const playCloseSound = () => {
  try {
    createBeepSound(400, 200, 'sine');
  } catch (error) {
    console.warn('Audio context not available');
  }
};