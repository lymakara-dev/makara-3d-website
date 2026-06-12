import { useCallback, useRef, useState } from 'react';

export type SoundState = 'off' | 'starting' | 'on' | 'stopping';

function fadeAudio(
  audio: HTMLAudioElement,
  targetVol: number,
  durationMs: number,
  onDone?: () => void,
): () => void {
  const startVol  = audio.volume;
  const startTime = performance.now();
  let raf: number;

  const tick = () => {
    const t = Math.min((performance.now() - startTime) / durationMs, 1);
    // clamp to [0, 1] — HTMLAudioElement throws on out-of-range values
    audio.volume = Math.max(0, Math.min(1, startVol + (targetVol - startVol) * t));
    if (t < 1) {
      raf = requestAnimationFrame(tick);
    } else {
      audio.volume = targetVol;
      onDone?.();
    }
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

export function useAmbientSound() {
  const [state, setState] = useState<SoundState>('off');
  const audioRef  = useRef<HTMLAudioElement | null>(null);
  const cancelRef = useRef<(() => void) | null>(null);

  const start = useCallback(() => {
    if (audioRef.current) return;
    setState('starting');

    const audio   = new Audio('/backgroundmusic.mp3');
    audio.loop    = true;
    audio.volume  = 0.35;   // start audible — don't begin at 0
    audio.preload = 'auto';
    audioRef.current = audio;

    audio.play()
      .then(() => {
        setState('on');
        // fade up from current volume to full target
        cancelRef.current?.();
        cancelRef.current = fadeAudio(audio, 0.55, 1800);
      })
      .catch((err) => {
        console.warn('[ambient] play() rejected:', err);
        audio.src        = '';
        audioRef.current = null;
        setState('off');
      });
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setState('stopping');
    cancelRef.current?.();
    cancelRef.current = fadeAudio(audio, 0, 1200, () => {
      audio.pause();
      audio.src        = '';
      audioRef.current = null;
      setState('off');
    });
  }, []);

  const toggle = useCallback(() => {
    if (state === 'off' || state === 'stopping') start();
    else stop();
  }, [state, start, stop]);

  return { state, toggle };
}
