import { useEffect, useRef } from 'react';

export function useSoundEffects() {
  const clickRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const click = new Audio('/clicksoundeffect.mp3');
    click.volume = 0.45;
    click.load();
    clickRef.current = click;

    const playClick = () => {
      const a = clickRef.current;
      if (!a) return;
      a.currentTime = 0;
      a.play().catch(() => {});
    };

    document.addEventListener('click', playClick);
    return () => {
      document.removeEventListener('click', playClick);
      click.src = '';
    };
  }, []);
}
